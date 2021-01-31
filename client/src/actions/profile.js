import axios from 'axios'
import { setAlert } from './alert'

import { GET_PROFILE, PROFILE_ERROR } from './types'

// Get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get('/mytweet/api/profile/me')

    dispatch({
      type: GET_PROFILE,
      payload: res,
    })
  } catch (err) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}

// Create or Update the profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const res = await axios.post('/mytweet/api/profile', formData, config)

    dispatch({
      type: GET_PROFILE,
      payload: res,
    })

    dispatch(setAlert(edit ? 'Profile Update' : 'Profile Created ', 'success'))

    if (!edit) {
      history.push('/dashboard')
    }
  } catch (err) {
    const errors = err.response.data.errors

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')))
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    })
  }
}
