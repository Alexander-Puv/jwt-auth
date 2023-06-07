import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react"
import LoginForm from "./components/LoginForm"
import { Context } from "./main"
import { IUser } from "./models/IUser"
import UserService from "./services/UserService"

function App() {
  const {store} = useContext(Context)
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  const getUsers = async () => {
    try {
      const response = await UserService.fetchUser()
      setUsers(response.data)
    } catch (e) {
      console.log(e);
    }
  }

  if (store.isLoading) {
    return <div>Loading....</div>
  }

  if (!store.isAuth) {
    return <div>
      <h1>AUTHORIZE YOURSELF!!!!!!!</h1>
      <LoginForm />
    </div>
  }

  return (
    <div>
      <h1>User is authorized {store.user.email}</h1>
      <button onClick={() => store.logout()}>Logout</button>
      <div>
        <button onClick={getUsers}>Get users</button>
      </div>
      {users.map(user =>
        <div key={user._id}>{user.email}</div>
      )}
    </div>
  )
}

export default observer(App)
