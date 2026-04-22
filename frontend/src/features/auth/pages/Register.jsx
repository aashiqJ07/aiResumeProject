import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const { loading, handleRegister } = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleRegister({ username, email, password })
        if (result.success) {
            navigate("/")
        } else {
            setError(result.message)
        }
    }

    return (
        <main>
            <div className="form-container">
                <h1>Register</h1>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>

                    {error && <p style={{ color: '#ff4d6d', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{error}</p>}
                    <button className='button primary-button' disabled={loading}>
                        {loading ? 'Please wait...' : 'Register'}
                    </button>

                </form>

                <p>Already have an account? <Link to={"/login"}>Login</Link> </p>
            </div>
        </main>
    )
}

export default Register