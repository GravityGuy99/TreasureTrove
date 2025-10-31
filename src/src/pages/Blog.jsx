import { Header } from '../components/Header.jsx'
import { LoginCheck } from '../components/LoginCheck.jsx'


//I gutted most of the blog page to only all LoginCheck, which is a reduced version of CreatePost
export function Blog() {

  return (
    <div style={{padding: 0}}>
      <Header />
      <hr />
      <br />
      <LoginCheck />
    </div>
  )
}

