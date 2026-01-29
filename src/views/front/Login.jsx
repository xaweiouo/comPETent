function Login() {
    return (
        <>
            <div className="container">
                <form>
                    <h1 className="text-danger text-center mb-3">登入</h1>
                    <div className="mb-5">
                        <label htmlFor="username" className="form-label">電子信箱</label>
                        <input id="username" type="email" className="form-control" name="username" />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">密碼</label>
                        <input id="password" type="password" className="form-control" name="password" />
                    </div>
                </form>
            </div>
        </>
    )
};
export default Login;