import { useEffect } from "react";
import { useNavigate } from "react-router"

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate('/',{replace:true})
    },3000)
  },[navigate]);

  return (
    <>
    <h1 className="text-center mt-9">404</h1>
    <p className="text-center">三秒後跳轉至首頁</p>
    </>
  )
}
export default NotFound