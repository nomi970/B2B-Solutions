// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  initializeCountryDropdown()
  initializePasswordToggle()
  initializeFormValidation()
  initializeModals()

  // Check if user is already logged in
  checkExistingSession()
})

// Country Dropdown Functionality
function initializeCountryDropdown() {
  const countryDropdown = document.getElementById("countryDropdown")
  const selectedCountry = document.getElementById("selectedCountry")

  if (!countryDropdown || !selectedCountry) return

  // Toggle dropdown
  selectedCountry.addEventListener("click", (e) => {
    e.stopPropagation()
    countryDropdown.classList.toggle("open")
  })

  // Select country option
  const countryOptions = document.querySelectorAll(".country-option")
  countryOptions.forEach((option) => {
    option.addEventListener("click", function () {
      const flagSrc = this.querySelector(".flag-icon").src
      const language = this.dataset.lang

      selectedCountry.querySelector(".flag-icon").src = flagSrc
      selectedCountry.querySelector("span").textContent = language

      countryDropdown.classList.remove("open")

      // Store selection
      localStorage.setItem(
        "selectedLanguage",
        JSON.stringify({
          flag: flagSrc,
          language: language,
          country: this.dataset.country,
        }),
      )

      showNotification("Language changed to " + language, "success")
    })
  })

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    countryDropdown.classList.remove("open")
  })

  // Load saved language preference
  const savedLanguage = localStorage.getItem("selectedLanguage")
  if (savedLanguage) {
    const lang = JSON.parse(savedLanguage)
    selectedCountry.querySelector(".flag-icon").src = lang.flag
    selectedCountry.querySelector("span").textContent = lang.language
  }
}

// Password Toggle Functionality
function initializePasswordToggle() {
  const passwordToggle = document.getElementById("passwordToggle")
  const passwordInput = document.getElementById("password")

  if (!passwordToggle || !passwordInput) return

  passwordToggle.addEventListener("click", function () {
    const icon = this.querySelector("i")

    if (passwordInput.type === "password") {
      passwordInput.type = "text"
      icon.classList.remove("fa-eye")
      icon.classList.add("fa-eye-slash")
      this.setAttribute("aria-label", "Hide password")
    } else {
      passwordInput.type = "password"
      icon.classList.remove("fa-eye-slash")
      icon.classList.add("fa-eye")
      this.setAttribute("aria-label", "Show password")
    }

    // Add bounce animation
    icon.classList.add("fa-bounce")
    setTimeout(() => {
      icon.classList.remove("fa-bounce")
    }, 600)
  })
}

// Form Validation
function initializeFormValidation() {
  const loginForm = document.getElementById("loginForm")
  if (!loginForm) return

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    // Clear previous errors
    clearErrors()

    let isValid = true

    // Validate username
    if (!username || username.length < 3) {
      showFieldError("username", "Username must be at least 3 characters")
      isValid = false
    }

    // Validate password
    if (!password || password.length < 6) {
      showFieldError("password", "Password must be at least 6 characters")
      isValid = false
    }

    if (isValid) {
      handleLogin()
    }
  })

  // Real-time validation
  const usernameInput = document.getElementById("username")
  const passwordInput = document.getElementById("password")

  if (usernameInput) {
    usernameInput.addEventListener("input", function () {
      if (this.value.length >= 3) {
        this.classList.add("valid")
        this.classList.remove("error")
        hideFieldError("username")
      } else {
        this.classList.add("error")
        this.classList.remove("valid")
      }
    })
  }

  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      if (this.value.length >= 6) {
        this.classList.add("valid")
        this.classList.remove("error")
        hideFieldError("password")
      } else {
        this.classList.add("error")
        this.classList.remove("valid")
      }
    })
  }
}

// Show field error
function showFieldError(fieldName, message) {
  const errorElement = document.getElementById(fieldName + "-error")
  const inputElement = document.getElementById(fieldName)

  if (errorElement) {
    errorElement.textContent = message
    errorElement.classList.add("show")
  }

  if (inputElement) {
    inputElement.classList.add("error")
    inputElement.classList.remove("valid")
  }
}

// Hide field error
function hideFieldError(fieldName) {
  const errorElement = document.getElementById(fieldName + "-error")
  const inputElement = document.getElementById(fieldName)

  if (errorElement) {
    errorElement.classList.remove("show")
  }

  if (inputElement) {
    inputElement.classList.remove("error")
  }
}

// Clear all errors
function clearErrors() {
  const errorElements = document.querySelectorAll(".error-message")
  const inputElements = document.querySelectorAll("input")

  errorElements.forEach((element) => {
    element.classList.remove("show")
  })

  inputElements.forEach((element) => {
    element.classList.remove("error")
  })
}

// Handle Login
function handleLogin() {
  const username = document.getElementById("username").value
  const password = document.getElementById("password").value
  const remember = document.getElementById("remember").checked
  const loginBtn = document.getElementById("loginBtn")

  if (!loginBtn) return

  // Show loading state
  loginBtn.classList.add("loading")
  loginBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    // Mock authentication
    if (authenticateUser(username, password)) {
      // Store user session
      const userData = {
        username: username,
        loginTime: new Date().toISOString(),
        remember: remember,
      }

      if (remember) {
        localStorage.setItem("userSession", JSON.stringify(userData))
      } else {
        sessionStorage.setItem("userSession", JSON.stringify(userData))
      }

      // Show success modal
      showSuccessModal()

      // Redirect after delay
      setTimeout(() => {
        window.location.href = "../dashboard/index.html"
      }, 3000)
    } else {
      // Show error
      showNotification("Invalid username or password", "error")

      // Add shake animation to form
      const formContainer = document.querySelector(".form-container")
      if (formContainer) {
        formContainer.classList.add("shake")
        setTimeout(() => {
          formContainer.classList.remove("shake")
        }, 600)
      }
    }

    // Reset button state
    loginBtn.classList.remove("loading")
    loginBtn.disabled = false
  }, 2000)
}

// Mock Authentication
function authenticateUser(username, password) {
  const users = {
    admin: "admin123",
    user: "user123",
    demo: "demo123",
    test: "test123",
  }

  return users[username] === password
}

// Check Existing Session
function checkExistingSession() {
  const sessionData = localStorage.getItem("userSession") || sessionStorage.getItem("userSession")

  if (sessionData) {
    const userData = JSON.parse(sessionData)
    const loginTime = new Date(userData.loginTime)
    const now = new Date()
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60)

    // If session is less than 24 hours old (or 30 days if remember me was checked)
    const maxHours = userData.remember ? 720 : 24 // 30 days or 24 hours

    if (hoursDiff < maxHours) {
      showNotification("Welcome back, " + userData.username + "!", "success")
      setTimeout(() => {
        window.location.href = "../dashboard/index.html"
      }, 1500)
    } else {
      // Clear expired session
      localStorage.removeItem("userSession")
      sessionStorage.removeItem("userSession")
    }
  }
}

// Modal Management
function initializeModals() {
  // Forgot Password Modal
  const forgotPassword = document.getElementById("forgotPassword")
  const closeForgotModal = document.getElementById("closeForgotModal")
  const forgotModal = document.getElementById("forgotModal")
  const forgotForm = document.getElementById("forgotForm")

  if (forgotPassword) {
    forgotPassword.addEventListener("click", (e) => {
      e.preventDefault()
      showModal("forgotModal")
    })
  }

  if (closeForgotModal) {
    closeForgotModal.addEventListener("click", () => {
      hideModal("forgotModal")
    })
  }

  // Close modal on overlay click
  const modalOverlays = document.querySelectorAll(".modal-overlay")
  modalOverlays.forEach((overlay) => {
    overlay.addEventListener("click", function (e) {
      if (e.target === this) {
        hideModal(this.id)
      }
    })
  })

  // Forgot password form
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault()
      handlePasswordReset()
    })
  }

  // ESC key to close modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const openModals = document.querySelectorAll(".modal-overlay.show")
      openModals.forEach((modal) => {
        hideModal(modal.id)
      })
    }
  })
}

// Show Modal
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return

  modal.classList.add("show")
  document.body.classList.add("modal-open")

  // Focus management
  setTimeout(() => {
    const firstInput = modal.querySelector("input")
    if (firstInput) firstInput.focus()
  }, 300)
}

// Hide Modal
function hideModal(modalId) {
  const modal = document.getElementById(modalId)
  if (!modal) return

  modal.classList.remove("show")
  document.body.classList.remove("modal-open")

  // Clear form data
  const form = modal.querySelector("form")
  if (form) form.reset()

  const errorMessages = modal.querySelectorAll(".error-message")
  errorMessages.forEach((error) => {
    error.classList.remove("show")
  })

  const inputs = modal.querySelectorAll("input")
  inputs.forEach((input) => {
    input.classList.remove("error", "valid")
  })
}

// Show Success Modal
function showSuccessModal() {
  showModal("successModal")
}

// Handle Password Reset
function handlePasswordReset() {
  const email = document.getElementById("resetEmail").value
  const resetBtn = document.querySelector(".reset-btn")

  if (!email) {
    showNotification("Please enter your email address", "error")
    return
  }

  if (resetBtn) {
    resetBtn.disabled = true
    resetBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'

    // Simulate API call
    setTimeout(() => {
      showNotification("Password reset link sent to " + email, "success")
      hideModal("forgotModal")
      resetBtn.disabled = false
      resetBtn.innerHTML = "Send Reset Link"
    }, 1500)
  }
}

// Notification System
function showNotification(message, type) {
  type = type || "info"

  const icons = {
    success: "fa-check-circle",
    error: "fa-exclamation-circle",
    warning: "fa-exclamation-triangle",
    info: "fa-info-circle",
  }

  const colors = {
    success: "#00b894",
    error: "#e74c3c",
    warning: "#fdcb6e",
    info: "#74b9ff",
  }

  const notification = document.createElement("div")
  notification.className = "notification"
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 15px 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 350px;
        border-left: 4px solid ${colors[type]};
    `

  notification.innerHTML = `
        <i class="fas ${icons[type]}" style="color: ${colors[type]};"></i>
        <span style="flex: 1;">${message}</span>
        <button class="close-notification" style="background: none; border: none; color: #666; cursor: pointer; padding: 2px;">
            <i class="fas fa-times"></i>
        </button>
    `

  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto hide after 5 seconds
  setTimeout(() => {
    hideNotification(notification)
  }, 5000)

  // Manual close
  const closeBtn = notification.querySelector(".close-notification")
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      hideNotification(notification)
    })
  }
}

function hideNotification(notification) {
  notification.style.transform = "translateX(100%)"
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 300)
}

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const loginForm = document.getElementById("loginForm")
    if (loginForm && loginForm.style.display !== "none") {
      loginForm.dispatchEvent(new Event("submit"))
    }
  }

  // Alt + L to focus username field
  if (e.altKey && e.key === "l") {
    e.preventDefault()
    const usernameField = document.getElementById("username")
    if (usernameField) {
      usernameField.focus()
    }
  }
})
