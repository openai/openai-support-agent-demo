## AI intake form conversation attributes

The Chatwoot AI intake form now saves the following fields directly on the conversation record. Each form input must use the matching Chatwoot attribute key as its `name` value so responses are stored automatically.

| Attribute key | Field purpose | Notes |
| --- | --- | --- |
| `customer_name` | Customer or requester name | Text input filled from the form or existing CRM record. |
| `company_name` | Customer company | Text input. Use the legal or trading name the customer provides. |
| `company_location` | Headquarters or site location | Text input. Capture city and country when possible. |
| `contact` | Best follow-up channel | Text input. Store email, phone number, or alternate contact instructions. |
| `complaint_type` | Complaint category | Select input restricted to the eight complaint categories listed below. |
| `issue_description` | Summary of the reported problem | Long-form text area copied from the form. |

### Complaint categories

Use one of these values when configuring the `complaint_type` select options:

1. `Delayed Supply`
2. `Delayed Quote`
3. `Equipment Malfunction`
4. `Employee Misconduct`
5. `Training`
6. `Maintenance`
7. `Other`
8. `Solution Failure`

### Agent workflow update

Because the form auto-populates these attributes, agents should review the conversation sidebar in Chatwoot before responding. The sidebar shows the captured company name, contact details, complaint category, and free-text issue summary so agents can immediately confirm details without re-asking the customer.
