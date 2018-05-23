<template>
  <div class="login">

    <div class="md-layout md-gutter md-alignment-top-center">
      <div class="md-layout-item md-size-70">
        <md-tabs class="md-elevation-5" md-alignment="centered" md-active-tab="tab-login">
          <md-tab id="tab-register" md-label="Register">
            <md-card class="md-accent note" v-if="register.error.status">
              <md-card-header>
                <md-card-header-text>
                  <div class="md-title"><md-icon>error</md-icon> Error!</div>
                </md-card-header-text>
                <md-button class="md-icon-button btn-close" @click="register.error.status = false">
                  <md-icon>close</md-icon>
                </md-button>
              </md-card-header>
              <md-card-content>{{ register.error.message }}</md-card-content>
            </md-card>

            <md-field :class="{'md-invalid': register.email.error.status}" md-clearable>
              <label>E-mail Address</label>
              <md-input v-model="register.email.value"></md-input>
              <span v-if="register.email.error.status" class="md-error">{{ register.email.error.message }}</span>
            </md-field>

            <md-field :class="{'md-invalid': register.password.error.status}" md-has-password>
              <label>Password</label>
              <md-input type="password" v-model="register.password.value"></md-input>
              <span v-if="register.password.error.status" class="md-error">{{ register.password.error.message }}</span>
            </md-field>

            <md-field :class="{'md-invalid': register.confirmPassword.error.status}" md-has-password>
              <label>Confirm Password</label>
              <md-input type="password" v-model="register.confirmPassword.value"></md-input>
              <span v-if="register.confirmPassword.error.status" class="md-error">{{ register.confirmPassword.error.message }}</span>
            </md-field>

            <md-button class="md-primary md-raised" :disabled="!checkRegisterStatus">Register</md-button>
          </md-tab>

          <md-tab id="tab-login" md-label="Login">
            <md-card class="md-accent note" v-if="login.error.status">
              <md-card-header>
                <md-card-header-text>
                  <div class="md-title"><md-icon>error</md-icon> Error!</div>
                </md-card-header-text>
                <md-button class="md-icon-button btn-close" @click="login.error.status = false">
                  <md-icon>close</md-icon>
                </md-button>
              </md-card-header>
              <md-card-content>{{ login.error.message }}</md-card-content>
            </md-card>
            <md-field :class="{'md-invalid': login.email.error.status}" md-clearable>
              <label>E-mail Address</label>
              <md-input v-model="login.email.value"></md-input>
              <span v-if="login.email.error.status" class="md-error">{{ login.email.error.message }}</span>
            </md-field>

            <md-field :class="{'md-invalid': login.password.error.status}" md-has-password>
              <label>Password</label>
              <md-input type="password" v-model="login.password.value"></md-input>
              <span v-if="login.password.error.status" class="md-error">{{ login.password.error.message }}</span>
            </md-field>

            <md-button class="md-primary md-raised" :disabled="!checkLoginStatus">Log in</md-button>
          </md-tab>
        </md-tabs>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      login: {
        email: {
          value: '',
          dirty: false,
          error: {
            status: false,
            message: ''
          }
        },
        password: {
          value: '',
          dirty: false,
          error: {
            status: false,
            message: ''
          }
        },
        error: {
          status: false,
          message: ''
        }
      },
      register: {
        email: {
          value: '',
          dirty: false,
          error: {
            status: false,
            message: ''
          }
        },
        password: {
          value: '',
          dirty: false,
          error: {
            status: false,
            message: ''
          }
        },
        confirmPassword: {
          value: '',
          dirty: false,
          error: {
            status: false,
            message: ''
          }
        },
        error: {
          status: false,
          message: ''
        }
      }
    }
  },
  computed: {
    checkLoginStatus () {
      return this.login.email.error.status === false && this.login.password.error.status === false && this.login.email.dirty === true && this.login.password.dirty === true
    },
    checkRegisterStatus () {
      return this.register.email.error.status === false && this.register.password.error.status === false && this.register.confirmPassword.error.status === false && this.register.email.dirty === true && this.register.password.dirty === true && this.register.confirmPassword.dirty === true
    }
  },
  watch: {
    'login.email.value' () {
      let eRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      this.login.email.dirty = true

      if (this.login.email.value === '') {
        this.login.email.error.status = true
        this.login.email.error.message = 'E-mail address cannot be empty.'
      } else if (!eRegEx.test(this.login.email.value)) {
        this.login.email.error.status = true
        this.login.email.error.message = 'Not a valid e-mail address.'
      } else {
        this.login.email.error.status = false
        this.login.email.error.message = ''
      }
    },
    'login.password.value' () {
      this.login.password.dirty = true

      if (this.login.password.value === '') {
        this.login.password.error.status = true
        this.login.password.error.message = 'Password cannot be empty.'
      } else {
        this.login.password.error.status = false
        this.login.password.error.message = ''
      }
    },
    'register.email.value' () {
      let eRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      this.register.email.dirty = true

      if (this.register.email.value === '') {
        this.register.email.error.status = true
        this.register.email.error.message = 'E-mail address cannot be empty.'
      } else if (!eRegEx.test(this.register.email.value)) {
        this.register.email.error.status = true
        this.register.email.error.message = 'Not a valid e-mail address.'
      } else {
        this.register.email.error.status = false
        this.register.email.error.message = ''
      }
    },
    'register.password.value' () {
      this.register.password.dirty = true

      if (this.register.password.value === '') {
        this.register.password.error.status = true
        this.register.password.error.message = 'Password cannot be empty.'
      } else if (this.register.password.value.length < 8) {
        this.register.password.error.status = true
        this.register.password.error.message = 'Password must contain at least 8 characters.'
      } else {
        this.register.password.error.status = false
        this.register.password.error.message = ''
      }
    },
    'register.confirmPassword.value' () {
      this.register.confirmPassword.dirty = true

      if (this.register.confirmPassword.value === '') {
        this.register.confirmPassword.error.status = true
        this.register.confirmPassword.error.message = 'Password cannot be empty.'
      } else if (this.register.confirmPassword.value !== this.register.password.value) {
        this.register.confirmPassword.error.status = true
        this.register.confirmPassword.error.message = 'Password does not match.'
      } else {
        this.register.confirmPassword.error.status = false
        this.register.confirmPassword.error.message = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .md-tab .note {
    margin: 0;

    .md-icon {
      color: #fff;
    }
  }
</style>
