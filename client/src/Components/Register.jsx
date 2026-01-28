export default function registerPage() {
    return(
        <div>
            <div className="">
                <div className="">
                    <form>
                        <label>Name</label>
                        <input placeholder="Enter Your Name" type="text"/>
                        <label>Email</label>
                        <input placeholder="Enter Your Email" type="text"/>
                        <label>Phone Number</label>
                        <input placeholder="Enter Phone Number" type="number"/>
                        <label>Enter Password</label>
                        <input placeholder="Enter Password" type="password"/>
                        <label>Confirm Your Password</label>
                        <input placeholder="Confirm Your Password" type="password"/>
                    </form>
                </div>
                <div className="">
                    <button>Register</button>
                </div>
            </div>

        </div>
    )
}