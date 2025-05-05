describe('Login Page', () => {
    beforeEach(() => {
      // Visit the login page before each test
      cy.visit('/auth/signin')
    })
  
    it('should display login form elements', () => {
      // Check if main elements are visible
      cy.contains('h1', 'Welcome back').should('be.visible')
      cy.get('#email').should('be.visible')
      cy.get('#password').should('be.visible')
      cy.contains('button', 'Sign In').should('be.visible')
    })
  
    it('should handle login with valid credentials', () => {
      // Type in the test credentials
      cy.get('#email').type('test')
      cy.get('#password').type('test123')
  
      // Submit the form
      cy.get('#signInForm').submit()
  
      // Add assertions based on what should happen after successful login
      // For example, if it redirects to dashboard:
      cy.url().should('include', '/dashboard')
    })
  
    it('should show validation for required fields', () => {
      // Try to submit empty form
      cy.get('#signInForm').submit()
      
      // Check HTML5 validation messages
      cy.get('#email').then($el => {
        expect($el[0].validationMessage).to.not.be.empty
      })
      cy.get('#password').then($el => {
        expect($el[0].validationMessage).to.not.be.empty
      })
    })
  
    it('should navigate to forgot password page', () => {
      cy.contains('Forgot password?').click()
      cy.url().should('include', '/auth/forgot-password')
    })
  
    it('should navigate to signup page', () => {
      cy.contains('Sign up').click()
      cy.url().should('include', '/auth/signup')
    })
  })