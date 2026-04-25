package com.ecommerce.project.service.impl;

import com.ecommerce.project.payload.StripePaymentDto;
import com.ecommerce.project.service.StripeService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Customer;
import com.stripe.model.CustomerSearchResult;
import com.stripe.model.PaymentIntent;
import com.stripe.param.CustomerCreateParams;
import com.stripe.param.CustomerSearchParams;
import com.stripe.param.PaymentIntentCreateParams;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class StripeServiceImpl implements StripeService {
    @Value("${stripe.secret.key}")
    private String stripeApiKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    @Override
    public PaymentIntent paymentIntent(StripePaymentDto stripePaymentDto) throws StripeException {

        Customer customer;

        CustomerSearchParams searchParams = CustomerSearchParams.builder()
                .setQuery("email:'" + stripePaymentDto.getEmail() + "'")
                .build();
        CustomerSearchResult customers = Customer.search(searchParams);
        if (customers.getData().isEmpty()) {
            CustomerCreateParams customerParams = CustomerCreateParams.builder()
                    .setName(stripePaymentDto.getName())
                    .setEmail(stripePaymentDto.getEmail())
                    .setAddress(
                            CustomerCreateParams.Address.builder()
                                    .setLine1(stripePaymentDto.getAddress().getStreet())
                                    .setCity(stripePaymentDto.getAddress().getCity())
                                    .setState(stripePaymentDto.getAddress().getState())
                                    .setPostalCode(stripePaymentDto.getAddress().getPincode())
                                    .setCountry(stripePaymentDto.getAddress().getCountry())
                                    .build())
                    .build();
            customer = Customer.create(customerParams);
        } else {
            customer = customers.getData().get(0);

        }

        // Build address if it exists
        CustomerCreateParams.Address.Builder addressBuilder = null;
        if (stripePaymentDto.getAddress() != null) {
            addressBuilder = CustomerCreateParams.Address.builder()
                    .setLine1(stripePaymentDto.getAddress().getStreet() != null
                            ? stripePaymentDto.getAddress().getStreet()
                            : "")
                    .setCity(stripePaymentDto.getAddress().getCity() != null ? stripePaymentDto.getAddress().getCity()
                            : "")
                    .setState(
                            stripePaymentDto.getAddress().getState() != null ? stripePaymentDto.getAddress().getState()
                                    : "")
                    .setPostalCode(stripePaymentDto.getAddress().getPincode() != null
                            ? stripePaymentDto.getAddress().getPincode()
                            : "")
                    .setCountry(stripePaymentDto.getAddress().getCountry() != null
                            ? stripePaymentDto.getAddress().getCountry()
                            : "");
        }

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(stripePaymentDto.getAmount())
                .setCurrency(stripePaymentDto.getCurrency())
                .setCustomer(customer.getId())
                .setDescription(stripePaymentDto.getDescription())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build())
                .build();
        try {
            PaymentIntent paymentIntent = PaymentIntent.create(params);
            return paymentIntent;
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }

    }
}
