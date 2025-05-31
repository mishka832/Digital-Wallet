# Postman Collection for API Testing

This folder contains the Postman collection to test the backend APIs of this project.

---

## How to Use

1. **Import the Collection**
   - Open Postman
   - Go to File > Import
   - Select `Digital Wallet and Fraud Detection API Collection.postman_collection.json`

2. **Generate Token (Login)**
   - Run the `Login` API request with required credentials.
   - Copy the token from the response.

3. **Use Token in Other Requests**
   - For all protected APIs, manually paste the copied token in the `Authorization` header (e.g., as `Bearer <token>`).
   - Make sure to update the token before making requests as it expires after 1hr.

---

## Notes

- No environment variables are used in this collection.
- Token automation is not implemented; manual token entry is required.
- Base URLs and other constants are hardcoded or defined in the request URLs.

---

This setup is for testing purposes. Future improvements can include adding environment variables and automating token handling.
