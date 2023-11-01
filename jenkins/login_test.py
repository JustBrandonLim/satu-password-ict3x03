from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyotp
import time
import selenium.common.exceptions

# Initialize WebDriver with headless option
options = webdriver.ChromeOptions()
options.add_argument('--ignore-ssl-errors=yes')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--headless')  # Run Chrome in headless mode
options.add_argument('--no-sandbox')  # Bypass OS security model, required for headless mode
options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems
driver = webdriver.Chrome(options=options)

# Flag to track success
test_successful = False

try:
    # Navigate to Login Page
    driver.get("https://happy-williamson.cloud/")  # Replace with your website's URL

    # Wait for the email field to be visible (increased timeout to 10 seconds)
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//input[@name='email']")))

    # Login Functionality using XPath
    username = driver.find_element(By.XPATH, "//input[@name='email']")
    password = driver.find_element(By.XPATH, "//input[@name='password']")
    username.send_keys("testuser@test.com")
    password.send_keys("12345678")

    # Generate OTP
    totpSecret = "BVCSO6DVJEHAIUKC"  # Replace with your TOTP secret
    totp = pyotp.TOTP(totpSecret)
    otp_code = totp.now()

    # Enter OTP
    otp_field = driver.find_element(By.XPATH, "//input[@name='otp']")
    otp_field.send_keys(otp_code)

    # Submit Login Form
    login_button = driver.find_element(By.XPATH, "//button[text()='Login']")
    login_button.click()

    # If no exceptions were thrown, set the success flag
    test_successful = True

except selenium.common.exceptions.TimeoutException:
    print("Timeout occurred: The page did not load or the element was not found within 10 seconds.")
    # Optionally, add more specific error handling or logging here

finally:
    # Close the browser after a delay or after verification
    time.sleep(5)  # Adjust time as needed
    driver.quit()

    # Print success message if test was successful
    if test_successful:
        print("Test completed successfully with no errors.")

