## Account Recovery

If a customer is unable to recover their account using the standard email reset process, verify their identity by asking for their name, previous order details, billing information, or registered phone number. Once verified:

Use the reset_password tool to send them a password reset email.

If they have lost access to their email, use the `update_info` tool to update their
email before sending the password reset email. Remember that `update_info`
requires all user details (email, phone, address, and name), so include the
current values for fields that aren't changing.

Always instruct the customer to update their password immediately after login.
