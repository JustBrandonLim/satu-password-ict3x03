from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyotp
import time
import selenium.common.exceptions

# Path to chromium-chromedriver
chromedriver_path = '/usr/bin/chromedriver'  # or the path where chromium-chromedriver is located

# Initialize WebDriver with headless option
options = webdriver.ChromeOptions()
options.add_argument('--ignore-ssl-errors=yes')
options.add_argument('--ignore-certificate-errors')
options.add_argument('--headless')  # Run Chrome in headless mode
options.add_argument('--no-sandbox')  # Bypass OS security model, required for headless mode
options.add_argument('--disable-dev-shm-usage')  # Overcome limited resource problems

# Set up service to point to chromium-chromedriver
service = Service(chromedriver_path)

# Initialize the driver with the service and options
driver = webdriver.Chrome(service=service, options=options)

# Flag to track success
test_successful = False

try:
    # Navigate to Login Page
    driver.get("https://18.141.182.156/") 

    # Wait for the email field to be visible (increased timeout to 10 seconds)
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, "//input[@name='email']")))

    # Login Functionality using XPath
    username = driver.find_element(By.XPATH, "//input[@name='email']")
    password = driver.find_element(By.XPATH, "//input[@name='password']")
    username.send_keys("testuser@test.com")
    password.send_keys("12345678")

    # Generate OTP
    totpSecret = "BVCSO6DVJEHAIUKC" 
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

finally:
    time.sleep(5) 
    driver.quit()

    if test_successful:
        print("Test completed successfully with no errors.")
