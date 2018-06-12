<template>
  <div class="login">

    <div class="md-layout md-gutter md-alignment-top-center">
      <div class="md-layout-item md-size-70">
        <note-card v-if="error.status" :message="error.message" @close="error.status = false"></note-card>

        <md-tabs class="md-elevation-5" md-alignment="centered" md-active-tab="tab-login" :md-dynamic-height="true">
          <md-tab id="tab-register" md-label="Register">
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

            <md-button class="md-primary md-raised" @click="registerUser" :disabled="!checkRegisterStatus">Register</md-button>
          </md-tab>

          <md-tab id="tab-login" md-label="Login">
            <div class="md-layout md-alignment-top-center text-center">
              <div class="md-layout-item md-small-hide"></div>
              <div class="md-layout-item google-login">
                <p>Log in with your Google Account</p>
                <button class="btn-google" @click="googleLogin">
                  <md-ripple>
                    <div class="btn-google-wrapper">
                      <div class="icon-google-wrapper">
                        <div class="icon-google">
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" viewBox="0 0 48 48" class="abcRioButtonSvg">
                            <g>
                              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                              <path fill="none" d="M0 0h48v48H0z"></path>
                            </g>
                          </svg>
                        </div>
                      </div>
                      <span class="btn-google-content">
                        <span id="not_signed_in8nedvnoy92gx">Sign in with Google</span>
                      </span>
                    </div>
                  </md-ripple>
                </button>
              </div>
              <div class="md-layout-item md-small-hide"></div>
            </div>

            <div class="md-layout md-alignment-center-center divider-or text-center">
              <div class="md-layout-item"><hr></div>
              <div class="md-layout-item md-size-5">
                <p class="md-caption">or</p>
              </div>
              <div class="md-layout-item"><hr></div>
            </div>

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

            <md-button class="md-primary md-raised" @click="loginUser" :disabled="!checkLoginStatus">Log in</md-button>
          </md-tab>
        </md-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from 'firebase'
import __bus__ from '../../bus'
import { __DB__ } from '../../main'
import NoteCard from '@/components/layouts/Note-Card'

export default {
  name: 'login',
  components: {
    NoteCard
  },
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
        }
      },
      error: {
        status: false,
        message: ''
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
  },
  methods: {
    loginUser () {
      if (this.checkLoginStatus) {
        Firebase.auth().signInWithEmailAndPassword(this.login.email.value, this.login.password.value)
          .then(user => {
            __DB__.collection('users').doc(user.uid).update({
              last_signin_at: user.metadata.lastSignInTime
            })

            __bus__.$emit('authUser', user)

            this.$router.replace('/home')
          }, err => {
            this.error.status = true
            this.error.message = err.message
          })
      }
    },
    registerUser () {
      if (this.checkRegisterStatus) {
        Firebase.auth().createUserWithEmailAndPassword(this.register.email.value, this.register.password.value)
          .then(user => {
            __DB__.collection('users').doc(user.uid).set({
              display_name: user.displayName,
              email: user.email,
              verified: user.emailVerified,
              phone_number: user.phoneNumber,
              photo_URL: user.photoURL,
              created_at: user.metadata.creationTime,
              last_signin_at: user.metadata.lastSignInTime,
              role: 'user'
            })

            __bus__.$emit('authUser', user)

            this.$router.replace('/home')
          }, err => {
            this.error.status = true
            this.error.message = err.message
          })
      }
    },
    googleLogin () {
      Firebase.auth().signInWithPopup(new Firebase.auth.GoogleAuthProvider()).then(u => {
        let user = u.user
        let otherInfo = u.additionalUserInfo

        if (otherInfo.isNewUser) {
          __DB__.collection('users').doc(user.uid).set({
            display_name: user.displayName,
            email: user.email,
            verified: user.emailVerified,
            phone_number: user.phoneNumber,
            photo_URL: user.photoURL,
            created_at: user.metadata.creationTime,
            last_signin_at: user.metadata.lastSignInTime,
            role: 'user'
          })
        } else {
          __DB__.collection('users').doc(user.uid).update({
            last_signin_at: user.metadata.lastSignInTime
          })
        }

        __bus__.$emit('authUser', user)

        this.$router.replace('/home')
      }).catch(err => {
        this.error.status = true
        this.error.message = err.message
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .text-center {
    text-align: center;
  }

  .divider-or hr{
    border-color: rgba(#fff, .5);
  }

  .btn-google {
    width: 240px;
    height: 50px;
    border: none;
    padding: 0;
    background-color: #4285f4;
    color: #fff;
    cursor: pointer;

    &:hover {
      box-shadow: 0 0 3px 3px rgba(66,133,244,.3);
    }

    .btn-google-wrapper {
      border: 1px solid transparent;
      width: 100%;
      height: 100%;
    }

    .icon-google-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 1px;
      padding: 15px;
      float: left;
      background-color: #fff;
    }

    .icon-google {
      position: relative;
    }

    .btn-google-content {
      vertical-align: top;
      line-height:48px;
      font-size:16px;
    }
  }
</style>
