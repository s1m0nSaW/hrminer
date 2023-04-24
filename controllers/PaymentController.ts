import { YooCheckout, ICreatePayment } from '@a2seven/yoo-checkout';

const checkout = new YooCheckout({ shopId: '210416', secretKey: 'live_zRQmjLk6PKuj-2UraISLLHmJqnAtHMmw1ZRsLNER4iI' });

const createPayload: ICreatePayment = {
    amount: {
        value: '99.00',
        currency: 'RUB'
    },
    payment_method_data: {
        type: 'bank_card'
    },
    confirmation: {
        type: 'redirect',
        return_url: 'test'
    }
};

export const create = async ( req: any, res: any) => {
    const idempotenceKey = req.body.id;

    try {
        const payment = await checkout.createPayment(createPayload, idempotenceKey);
        res.json(payment);
    } catch (err) {
        console.log(err);
        res.json(err);
    }
}
