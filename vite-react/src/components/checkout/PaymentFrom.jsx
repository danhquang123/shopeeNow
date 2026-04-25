import React, { useState, useEffect, useMemo } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js'
import axiosInstance from '../../api/axiosInstance'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '')

const CheckoutForm = ({ amount, onSuccess, onError }) => {
    const stripe = useStripe()
    const elements = useElements()
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!stripe || !elements) {
            setMessage('Stripe chưa sẵn sàng. Vui lòng thử lại sau.')
            return
        }

        try {
            setIsLoading(true)
            setMessage('Đang xác nhận thanh toán...')

            const result = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href,
                },
                redirect: 'if_required',
            })

            if (result.error) {
                setMessage(result.error.message || 'Thanh toán không thành công.')
                onError?.(result.error)
                return
            }

            if (result.paymentIntent?.status === 'succeeded') {
                setMessage('Thanh toán thành công!')
                onSuccess?.(result.paymentIntent)
            } else {
                setMessage(`Trạng thái thanh toán: ${result.paymentIntent?.status}`)
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message || error?.message || 'Có lỗi khi xác nhận thanh toán.'
            setMessage(errorMessage)
            onError?.(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="card rounded-4 p-4 text-start">
            <h5 className="fw-bold mb-3">Thanh toán bằng thẻ</h5>

            <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge bg-white border text-dark py-2 px-3">Card</span>
                <span className="badge bg-white border text-dark py-2 px-3">Cash App Pay</span>
                <span className="badge bg-white border text-dark py-2 px-3">Amazon Pay</span>
            </div>

            <div className="mb-3">
                <label className="form-label">Thông tin thanh toán</label>
                <div className="p-3 border rounded-3 bg-white">
                    <PaymentElement />
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <div className="text-muted small">Số tiền</div>
                    <div className="fw-bold">${(amount / 100).toFixed(2)}</div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={!stripe || isLoading}>
                    {isLoading ? 'Đang xử lý...' : 'Thanh toán ngay'}
                </button>
            </div>

            {message && (
                <div className={`alert ${message.toLowerCase().includes('lỗi') || message.toLowerCase().includes('không') ? 'alert-danger' : 'alert-success'}`}>
                    {message}
                </div>
            )}
        </form>
    )
}

export const PaymentForm = ({ amount, currency = 'usd', address, email, name, onSuccess, onError }) => {
    const [clientSecret, setClientSecret] = useState('')
    const [statusMessage, setStatusMessage] = useState('Đang thiết lập phương thức thanh toán...')
    const [loadingSecret, setLoadingSecret] = useState(true)

    useEffect(() => {
        const fetchClientSecret = async () => {
            try {
                const response = await axiosInstance.post('/order/stripe-client-secret', {
                    amount,
                    currency,
                    address,
                    email,
                    name,
                })
                setClientSecret(response.data)
                setStatusMessage('')
            } catch (error) {
                const errorMessage =
                    error?.response?.data?.message || error?.message || 'Không thể tạo request thanh toán.'
                setStatusMessage(errorMessage)
                onError?.(error)
            } finally {
                setLoadingSecret(false)
            }
        }

        fetchClientSecret()
    }, [amount, currency, address, email, name, onError])

    const elementsOptions = useMemo(
        () => ({
            clientSecret,
            appearance: { theme: 'stripe' },
            paymentElement: { layout: 'tabs' },
        }),
        [clientSecret]
    )

    if (loadingSecret) {
        return <div className="alert alert-info">{statusMessage}</div>
    }

    if (!clientSecret) {
        return <div className="alert alert-danger">{statusMessage || 'Không thể kết nối với Stripe.'}</div>
    }

    return (
        <Elements stripe={stripePromise} options={elementsOptions}>
            <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
        </Elements>
    )
}
