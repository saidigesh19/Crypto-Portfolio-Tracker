import { useState } from "react";

export default function loginPage() {
  const [data, setData] = useState();

  return (
    <div className="">
      <div className="">
        <div className="">
            <img src="" alt=""/>
            <h2> Login </h2>
        </div>
        <div className="">
            <form className="">
                <label>User ID</label>
                <input placeholder="Enter Your User Id" type="text"/>
                <label>Password</label>
                <input type="password" placeholder="Enter Your Password"/>
            </form>
        </div>
        <div className="">
            <button>Login</button>
        </div>
      </div>
    </div>
  );
}
