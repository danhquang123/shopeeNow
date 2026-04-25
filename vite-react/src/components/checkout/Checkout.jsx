import React, { useState, useMemo, useEffect } from 'react';
import { Stepper, Step } from 'react-form-stepper';
import { useCart } from '../CartContext';
import AddressInfo from './AddressInfo';
import { PaymentForm } from './PaymentFrom';
import axiosInstance from '../../api/axiosInstance';

const Checkout = () => {
    const { selectedCartItems, refreshCart } = useCart();
    const [activeStep, setActiveStep] = useState(0);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [orderNote, setOrderNote] = useState('');
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [isCreatingOrder, setIsCreatingOrder] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [hasAutoPlacedOrder, setHasAutoPlacedOrder] = useState(false);
    const [isLoadingUserEmail, setIsLoadingUserEmail] = useState(true);

    // Fetch user email from localStorage + API fallback
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                setIsLoadingUserEmail(true);
                console.log('📧 [Checkout] Iniciando busca de email do usuário...');

                // Priority 1: Get from localStorage (set during login)
                let email = localStorage.getItem('userEmail') || '';
                let name = localStorage.getItem('userName') || 'Guest';

                if (email) {
                    console.log('✓ [Checkout] Email obtido do localStorage:', email);
                    setUserEmail(email);
                    setUserName(name);
                    setIsLoadingUserEmail(false);
                    return;
                }

                // Priority 2: Fetch from API if not in localStorage
                console.log('⚠️ [Checkout] Email não encontrado em localStorage. Buscando da API...');

                try {
                    const response = await axiosInstance.get('/auth/user/email');
                    email = response.data?.email || '';
                    name = response.data?.username || 'Guest';

                    if (email) {
                        console.log('✓ [Checkout] Email obtido da API:', email);
                        // Save to localStorage for future use
                        localStorage.setItem('userEmail', email);
                        localStorage.setItem('userName', name);
                        setUserEmail(email);
                        setUserName(name);
                    } else {
                        console.warn('⚠️ [Checkout] API retornou vazio para email');
                        setUserEmail('');
                        setUserName(name || 'Guest');
                    }
                } catch (apiError) {
                    console.warn('⚠️ [Checkout] Erro ao buscar email da API:', apiError?.response?.status, apiError?.message);
                    setUserEmail('');
                    setUserName(name || 'Guest');
                }
            } catch (error) {
                console.error('❌ [Checkout] Erro na busca de email:', error?.message);
                setUserEmail('');
                setUserName('Guest');
            } finally {
                setIsLoadingUserEmail(false);
            }
        };

        fetchUserEmail();
    }, []);

    // Auto-place order when Stripe payment completed
    useEffect(() => {
        const placeOrderForStripe = async () => {
            if (!userEmail) {
                alert('Không thể lấy email tài khoản. Vui lòng đăng nhập lại.');
                setHasAutoPlacedOrder(false);
                return;
            }

            if (!selectedAddress) {
                alert('Bạn phải chọn địa chỉ giao hàng trước khi hoàn tất.')
                setActiveStep(0)
                return;
            }

            if (selectedCartItems.length === 0) {
                alert('Không có sản phẩm được chọn để thanh toán.')
                setActiveStep(0)
                return;
            }

            try {
                setIsCreatingOrder(true);

                const orderRequest = {
                    addressId: selectedAddress?.addressId ?? selectedAddress?.id ?? selectedAddress?.address_id,
                    pgName: 'stripe',
                    pgPaymentId: paymentIntentId || 'card-confirmed',
                    pgStatus: paymentStatus,
                    pgResponseMessage: 'Thanh toán Stripe thành công',
                    selectedItems: selectedCartItems.map((item) => ({
                        productId: item?.productId ?? item?.id,
                        quantity: item.quantity || 1,
                    })),
                };

                await axiosInstance.post('/order/users/payment/card', orderRequest);
                await refreshCart();
                setOrderPlaced(true);
            } catch (error) {
                alert(error?.response?.data?.message || 'Có lỗi khi tạo đơn hàng. Vui lòng thử lại.');
                console.error('Order creation error:', error);
                setHasAutoPlacedOrder(false); // Reset flag if order creation failed
            } finally {
                setIsCreatingOrder(false);
            }
        };

        if (activeStep === 3 && paymentMethod === 'card' && paymentCompleted && !hasAutoPlacedOrder && !isCreatingOrder) {
            setHasAutoPlacedOrder(true);
            placeOrderForStripe();
        }
    }, [activeStep, paymentMethod, paymentCompleted, hasAutoPlacedOrder, isCreatingOrder, selectedAddress, selectedCartItems, paymentIntentId, paymentStatus, refreshCart, userEmail]);

    const steps = [
        { label: 'Address' },
        { label: 'Payment Method' },
        { label: 'Order Summary' },
        { label: 'Payment' },
    ];

    const totalAmount = useMemo(() => {
        return selectedCartItems?.reduce((sum, item) => sum + item.specialPrice * item.quantity, 0) || 0;
    }, [selectedCartItems]);

    const totalDiscount = useMemo(() => {
        return selectedCartItems?.reduce((sum, item) => sum + ((item.price || 0) - item.specialPrice) * item.quantity, 0) || 0;
    }, [selectedCartItems]);

    const getCartItemKey = (item) => item?.productId ?? item?.id;

    const goNext = () => {
        if (activeStep === 0 && !selectedAddress) {
            alert('Vui lòng chọn hoặc thêm địa chỉ giao hàng trước khi tiếp tục.');
            return;
        }

        if (selectedCartItems.length === 0) {
            alert('Vui lòng chọn ít nhất một sản phẩm trong giỏ hàng để tiếp tục thanh toán.');
            return;
        }

        if (activeStep === 1) {
            if (!paymentMethod) {
                alert('Vui lòng chọn phương thức thanh toán.');
                return;
            }
            // Only require email for card payment, COD can proceed without it
            // (email will be fetched from user account when creating order)
            if (paymentMethod === 'card' && isLoadingUserEmail) {
                alert('Đang lấy thông tin tài khoản. Vui lòng chờ một chút.');
                return;
            }
        }

        if (activeStep === 2 && paymentMethod === 'card' && !paymentCompleted) {
            alert('Vui lòng hoàn tất thanh toán bằng thẻ trước khi tiếp tục.');
            return;
        }

        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const goBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
        // Reset auto-place order flag when going back
        setHasAutoPlacedOrder(false);
    };

    const handleCardSuccess = (paymentIntent) => {
        setPaymentCompleted(true);
        setPaymentError('');
        setPaymentIntentId(paymentIntent?.id || '');
        setPaymentStatus(paymentIntent?.status || 'succeeded');
        // Tự động chuyển sang bước 3 (Payment Result) sau 1 giây
        setTimeout(() => {
            setActiveStep(3);
        }, 1000);
    };

    const handleCardError = (error) => {
        setPaymentError(error?.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            alert('Bạn phải chọn địa chỉ giao hàng trước khi hoàn tất.')
            setActiveStep(0)
            return;
        }

        if (selectedCartItems.length === 0) {
            alert('Không có sản phẩm được chọn để thanh toán.')
            setActiveStep(0)
            return;
        }

        if (paymentMethod === 'card' && !paymentCompleted) {
            alert('Vui lòng hoàn tất thanh toán bằng thẻ trước khi xác nhận đơn hàng.')
            return;
        }

        try {
            setIsCreatingOrder(true);

            const orderRequest = {
                addressId: selectedAddress?.addressId ?? selectedAddress?.id ?? selectedAddress?.address_id,
                pgName: paymentMethod === 'card' ? 'stripe' : 'cod',
                pgPaymentId: paymentMethod === 'card' ? paymentIntentId || 'card-confirmed' : 'cod-pending',
                pgStatus: paymentMethod === 'card' ? paymentStatus : 'pending',
                pgResponseMessage: orderNote || (paymentMethod === 'card' ? 'Thanh toán Stripe thành công' : 'Đơn hàng COD đặt thành công'),
                selectedItems: selectedCartItems.map((item) => ({
                    productId: getCartItemKey(item),
                    quantity: item.quantity || 1,
                })),
            };

            console.log('📤 Placing order with:', { paymentMethod, email: userEmail, ...orderRequest });

            await axiosInstance.post(`/order/users/payment/${paymentMethod}`, orderRequest);
            console.log('✓ Order placed successfully');

            await refreshCart();
            setOrderPlaced(true);
        } catch (error) {
            console.error('❌ Order creation error:', error?.response?.data?.message || error?.message);
            alert(error?.response?.data?.message || 'Có lỗi khi tạo đơn hàng. Vui lòng thử lại.');
        } finally {
            setIsCreatingOrder(false);
        }
    };

    const renderAddressSummary = () => {
        if (!selectedAddress) {
            return <p className="text-danger">Chưa có địa chỉ giao hàng được chọn.</p>;
        }

        return (
            <div className="card rounded-4 p-4 text-start mb-4">
                <h5 className="fw-bold mb-3">Địa chỉ giao hàng đã chọn</h5>
                <p className="mb-1 fw-semibold">{selectedAddress.buildingName || selectedAddress.street}</p>
                <p className="mb-1">{selectedAddress.street}</p>
                <p className="mb-1">{selectedAddress.city}, {selectedAddress.state}</p>
                <p className="mb-1">{selectedAddress.country}</p>
                <p className="mb-0">Mã bưu chính: {selectedAddress.pincode}</p>
            </div>
        );
    };

    const renderOrderSummary = () => (
        <div className="text-start">
            <div className="card rounded-4 p-4 mb-4">
                <h5 className="fw-bold mb-3">Chi tiết đơn hàng</h5>
                {selectedCartItems?.length > 0 ? (
                    selectedCartItems.map((item) => (
                        <div key={item.productId ?? item.id} className="d-flex justify-content-between align-items-start py-3 border-bottom">
                            <div>
                                <p className="fw-bold mb-1">{item.productName}</p>
                                <p className="small text-muted mb-0">Số lượng: {item.quantity}</p>
                            </div>
                            <span className="fw-bold">${(item.specialPrice * item.quantity).toLocaleString()}</span>
                        </div>
                    ))
                ) : (
                    <p className="text-muted">Không có sản phẩm được chọn. Vui lòng trở lại giỏ hàng và chọn sản phẩm.</p>
                )}
            </div>

            <div className="card rounded-4 p-4 text-start">
                <h5 className="fw-bold mb-3">Tóm tắt thanh toán</h5>
                <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính</span>
                    <span>${(totalAmount + totalDiscount).toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-danger">
                    <span>Tiết kiệm</span>
                    <span>-${totalDiscount.toLocaleString()}</span>
                </div>
                <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Vận chuyển</span>
                    <span>Miễn phí</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                    <span>Tổng cộng</span>
                    <span>${totalAmount.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );

    if (orderPlaced) {
        return (
            <div className="container py-5 min-vh-100">
                <div className="card shadow-sm border-0 p-5 rounded-4 text-center">
                    <div className="display-4 mb-4">🎉</div>
                    <h2 className="fw-bold mb-3">Đặt hàng thành công!</h2>
                    <p className="text-muted mb-4">Đơn hàng của bạn đang được xử lý. Cảm ơn bạn đã mua sắm.</p>
                    <button className="btn btn-primary px-5 py-3" onClick={() => window.location.assign('/')}>Về trang chủ</button>
                </div>
            </div>
        );
    }

    return (
        <div className='container py-5 min-vh-100'>
            <div className="card shadow-sm border-0 p-4 rounded-4">
                <Stepper
                    activeStep={activeStep}
                    styleConfig={{
                        activeBgColor: '#0d6efd',
                        completedBgColor: '#198754',
                        size: '2em'
                    }}
                >
                    {steps.map((step, index) => (
                        <Step key={index} label={step.label} />
                    ))}
                </Stepper>

                <div className="p-5 border rounded-3 my-4 bg-light">
                    {activeStep === 0 && (
                        <AddressInfo
                            selectedAddressId={selectedAddress?.addressId ?? selectedAddress?.id ?? selectedAddress?.address_id}
                            onSelectAddress={setSelectedAddress}
                        />
                    )}

                    {activeStep === 1 && (
                        <div>
                            <h4 className="fw-bold mb-4">💳 Chọn phương thức thanh toán</h4>
                            {isLoadingUserEmail && (
                                <div className="alert alert-info mb-4">
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Đang tải...</span>
                                    </div>
                                    &nbsp; Đang lấy thông tin tài khoản của bạn...
                                </div>
                            )}
                            <div className="row g-3 mb-4">
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className={`btn w-100 text-start p-4 rounded-4 ${paymentMethod === 'cod' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                                        onClick={() => {
                                            setPaymentMethod('cod');
                                            setPaymentCompleted(false);
                                            setHasAutoPlacedOrder(false);
                                        }}
                                    >
                                        <h5 className="mb-2">Thanh toán khi nhận hàng</h5>
                                        <p className="mb-0 text-muted">Thanh toán khi nhận hàng tại địa chỉ giao.</p>
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button
                                        type="button"
                                        className={`btn w-100 text-start p-4 rounded-4 ${paymentMethod === 'card' ? 'btn-primary text-white' : 'btn-outline-secondary'}`}
                                        onClick={() => {
                                            setPaymentMethod('card');
                                            setHasAutoPlacedOrder(false);
                                        }}
                                    >
                                        <h5 className="mb-2">Thanh toán bằng thẻ</h5>
                                        <p className="mb-0 text-muted">Thanh toán online bằng Visa/Mastercard.</p>
                                    </button>
                                </div>
                            </div>

                            {paymentMethod === 'cod' && (
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Ghi chú đơn hàng</label>
                                    <textarea
                                        className="form-control rounded-4 border-2"
                                        rows={4}
                                        value={orderNote}
                                        onChange={(e) => setOrderNote(e.target.value)}
                                        placeholder="Ghi chú thêm cho người giao hàng..."
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {activeStep === 2 && (
                        <div>
                            <h4 className="fw-bold mb-4">📝 Xác nhận đơn hàng</h4>
                            {renderAddressSummary()}
                            {renderOrderSummary()}

                            {paymentMethod === 'card' && !paymentCompleted && (
                                <div className="mt-4">
                                    <h5 className="fw-bold mb-3">Hoàn tất thanh toán thẻ</h5>
                                    {isLoadingUserEmail ? (
                                        <div className="alert alert-info">
                                            <div className="spinner-border spinner-border-sm" role="status">
                                                <span className="visually-hidden">Đang tải...</span>
                                            </div>
                                            &nbsp; Đang lấy thông tin tài khoản...
                                        </div>
                                    ) : !userEmail ? (
                                        <div className="alert alert-danger">
                                            <strong>Lỗi:</strong> Không thể lấy được email tài khoản của bạn. Vui lòng <a href="/login" className="alert-link">đăng nhập lại</a>.
                                        </div>
                                    ) : (
                                        <PaymentForm
                                            amount={Math.round(totalAmount * 100)}
                                            currency="usd"
                                            address={selectedAddress}
                                            email={userEmail}
                                            name={userName}
                                            onSuccess={handleCardSuccess}
                                            onError={handleCardError}
                                        />
                                    )}
                                </div>
                            )}

                            {paymentMethod === 'card' && paymentCompleted && (
                                <div className="alert alert-success mt-4">
                                    ✓ Thanh toán bằng thẻ đã hoàn tất. Chuyển tiếp...
                                </div>
                            )}
                        </div>
                    )}

                    {activeStep === 3 && (
                        <div className="text-center p-5">
                            <h4 className="fw-bold mb-4">🚀 Kết quả thanh toán</h4>
                            {paymentMethod === 'card' ? (
                                paymentCompleted ? (
                                    isCreatingOrder ? (
                                        <div className="card rounded-4 p-4 border-info">
                                            <div className="spinner-border text-info mb-3" role="status">
                                                <span className="visually-hidden">Đang tải...</span>
                                            </div>
                                            <h5 className="fw-bold text-info mb-2">Đang tạo đơn hàng...</h5>
                                            <p className="text-muted">Vui lòng chờ trong giây lát.</p>
                                        </div>
                                    ) : (
                                        <div className="card rounded-4 p-4 border-success">
                                            <div className="display-6 text-success mb-3">✓</div>
                                            <h5 className="fw-bold text-success mb-2">Thanh toán thành công!</h5>
                                            <p className="text-muted">Thanh toán bằng thẻ đã được xác nhận. Đơn hàng sẽ được tạo ngay.</p>
                                        </div>
                                    )
                                ) : paymentError ? (
                                    <div className="card rounded-4 p-4 border-danger">
                                        <div className="display-6 text-danger mb-3">✗</div>
                                        <h5 className="fw-bold text-danger mb-2">Thanh toán thất bại!</h5>
                                        <p className="text-danger">{paymentError}</p>
                                        <button className="btn btn-warning" onClick={() => setActiveStep(1)}>
                                            Quay lại để thử lại
                                        </button>
                                    </div>
                                ) : (
                                    <div className="card rounded-4 p-4">
                                        <p className="text-muted">Đang xử lý...</p>
                                    </div>
                                )
                            ) : (
                                <div className="card rounded-4 p-4 border-info">
                                    <div className="display-6 text-info mb-3">💳</div>
                                    <h5 className="fw-bold text-info mb-2">Thanh toán khi nhận hàng</h5>
                                    <p className="text-muted">Bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="d-flex justify-content-between mt-4">
                    <button
                        className="btn btn-secondary px-4"
                        onClick={goBack}
                        disabled={activeStep === 0}
                    >
                        Quay lại
                    </button>

                    {/* Bước 2 với Card: Không show nút Tiếp theo, user bấm Thanh toán ngay trong form */}
                    {activeStep < steps.length - 1 && !(activeStep === 2 && paymentMethod === 'card') ? (
                        <button className="btn btn-primary px-4" onClick={goNext}>
                            Tiếp theo
                        </button>
                    ) : null}

                    {/* Bước cuối cùng: Show nút Hoàn tất */}
                    {activeStep === steps.length - 1 ? (
                        paymentMethod === 'card' && paymentCompleted ? (
                            // Card payment completed: Don't show button, auto-placing order
                            null
                        ) : (
                            // COD hoặc Card chưa hoàn tất: Show nút Hoàn tất
                            <button
                                className="btn btn-success px-4"
                                onClick={handlePlaceOrder}
                                disabled={paymentMethod === 'card' && !paymentCompleted || isCreatingOrder}
                            >
                                {isCreatingOrder ? 'Đang xử lý...' : 'Hoàn tất'}
                            </button>
                        )
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Checkout;