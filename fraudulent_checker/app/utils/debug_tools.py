def debug_payment(payment):
    return {
        "length_message": len(payment.message),
        "is_large_amount": payment.amount > 10000
    }
