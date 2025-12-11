## Update Account Information

If a customer cannot update their account details:

Verify their identity by asking for their name, previous order details, billing information, or registered phone number.

Once verified, use the `update_info` tool to update the customer's details:

- Email
- Phone number
- Shipping address
- Name

Confirm the changes with the customer first to prevent errors.

When calling `update_info`, **all** fields must be provided. Pass the current
values for fields that aren't changing, for example:

`update_info({ user_id, email, phone, address, name })`
