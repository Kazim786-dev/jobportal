import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    axios.post('http://localhost:8000/user/signup', { email, password, name,contactNo,organization,role })
    .then(res=>{
      alert('SignUp successful!');
    
    // Redirect user to login page
      window.location.href = '/login';
      
    })
    .catch(err=>{
      console.log(err)
      alert('SignUp failed');
    })

    // Clear the form inputs
    setEmail('');
    setPassword('');
    setName('');
    setContactNo('');
    setOrganization('');
    setRole('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          required
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicContactNo">
        <Form.Label>Contact No</Form.Label>
        <Form.Control
          type="text"
          required
          placeholder="Enter your contact number"
          value={contactNo}
          onChange={(e) => setContactNo(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicOrganization">
        <Form.Label>Organization</Form.Label>
        <Form.Control
          type="text"
          required
          placeholder="Enter your organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="formBasicRole">
        <Form.Label>Role</Form.Label>
        <Form.Select
          required
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">Choose your role</option>
          <option value="student">Student</option>
          <option value="employer">Employer</option>
        </Form.Select>
      </Form.Group>

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default SignupForm;
