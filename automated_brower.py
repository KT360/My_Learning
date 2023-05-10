from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Replace the path below with the path to your WebDriver executable
driver = webdriver.Chrome(executable_path='path/to/chromedriver')

# Navigate to the Power BI login page
driver.get('https://app.powerbi.com/')

# Replace the placeholders below with your Power BI email and password
email = 'your_email@example.com'
password = 'your_password'

# Locate the email input field and enter your email
email_input = driver.find_element_by_name('loginfmt')
email_input.send_keys(email)
email_input.send_keys(Keys.RETURN)

# Wait for the password input field to load
time.sleep(2)

# Locate the password input field and enter your password
password_input = driver.find_element_by_name('passwd')
password_input.send_keys(password)
password_input.send_keys(Keys.RETURN)

# Wait for the login process to complete
time.sleep(5)

# Replace the URL below with the URL of your Power BI dashboard
dashboard_url = 'https://app.powerbi.com/groups/me/dashboards/your_dashboard_id'
driver.get(dashboard_url)

# Wait for the dashboard to load
time.sleep(5)


# Locate the filter pane
filter_pane_button = driver.find_element_by_xpath("//button[@title='Filters']")
filter_pane_button.click()

# Wait for the filter pane to load
time.sleep(2)

# Replace 'Slicer_Name' with the name of the slicer you want to interact with
slicer_name = 'Slicer_Name'

# Locate the slicer by its name and click on it to expand
slicer = driver.find_element_by_xpath(f"//div[contains(text(), '{slicer_name}')]")
slicer.click()

# Wait for the slicer options to load
time.sleep(2)


# Replace 'Filter_Value' with the value you want to apply to the slicer
filter_value = 'Filter_Value'

# Locate the filter value and click on it to apply the filter
filter_option = driver.find_element_by_xpath(f"//label[contains(text(), '{filter_value}')]")
filter_option.click()

# Wait for the filter to be applied and the dashboard to update
time.sleep(5)

# Assuming you have logged in and navigated to the Power BI dashboard
# Replace 'unique_identifier' with the unique identifier for your visual (e.g., id, CSS class, or attribute)
unique_identifier = 'unique_identifier'

# Locate the visual container
visual_container = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.CSS_SELECTOR, f'[your_selector="{unique_identifier}"]'))
)

# Click on the (...) icon
visual_menu_icon = visual_container.find_element(By.CSS_SELECTOR, '[aria-label="More options"]')
visual_menu_icon.click()

# Wait for the context menu to load
export_data_option = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.XPATH, '//button[contains(text(), "Export data")]'))
)

# Click on the "Export data" option
export_data_option.click()

# The data export process will start, and the Excel file will be downloaded