import { observer } from "mobx-react-lite"
import { useContext, useState } from 'react'
import { Context } from '../main'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const {store} = useContext(Context)

  return (
    <div>
      <input
        value={email} onChange={e => setEmail(e.target.value)}
        type='email' placeholder='Email'
      />
      <input
        value={password} onChange={e => setPassword(e.target.value)}
        type='password' placeholder='Password'
      />
      <button onClick={() => store.login(email, password)}>Log in</button>
      <button onClick={() => store.registration(email, password)}>Sign up</button>
    </div>
  )
}

export default observer(LoginForm)