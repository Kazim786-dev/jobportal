import React, { useState, useEffect } from 'react';
import { Navbar, Form, FormControl, Button, Container, Row, Col, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import axios from 'axios';

const StudentDashboard = () => {
    const [jobPostings, setJobPostings] = useState([]);
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState('');
    const [jobTags, setJobTags] = useState([]);
    const [keywords, setKeywords] = useState('');

    const token = localStorage.getItem('token')


    useEffect(() => {
        axios.get('http://localhost:8000/std/jobs',
            {
                headers: {
                    token: token
                }
            }
        )
            .then((res) => {
                // console.clear()
                setJobPostings(res.data)
            })
            .catch(() => {

            })
    }, [])

    const handleJobSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:8000/std/jobs/search',
                {
                    headers: {
                        token: token
                    },
                    params: {
                        jobTitle,
                        location,
                        salary,
                        jobTags,
                        keywords,
                    },
                }
            );

            setJobPostings(response.data);
        } catch (error) {
            console.error(error);
        }
    };


    const handleApplyJob = (jobPostingId) => {
        // Show apply form
        const applyForm = document.getElementById(`applyForm-${jobPostingId}`);
        if (applyForm) {
            applyForm.style.display = 'block';
        }
    };

    const handleSubmitApplication = async (event, jobPostingId) => {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        try {
            const response = await axios.post('http://localhost:8000/std/job/apply', formData,
                {
                    headers: {
                        token: token
                    }
                });
            console.log(response.data);
            alert('Job application submitted successfully!\nWait for the employer to update the status of application');
            // Hide apply form
            const applyForm = document.getElementById(`applyForm-${jobPostingId}`);
            if (applyForm) {
                applyForm.style.display = 'none';
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit job application');
        }
    };

    return (
        <>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Form inline onSubmit={handleJobSearch}>
                        <FormControl type="text" placeholder="Job Title" className="mr-sm-2" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                        <FormControl type="text" placeholder="Location" className="mr-sm-2" value={location} onChange={(e) => setLocation(e.target.value)} />
                        <FormControl type="text" placeholder="Salary" className="mr-sm-2" value={salary} onChange={(e) => setSalary(e.target.value)} />
                        <FormControl type="text" placeholder="Job Tags" className="mr-sm-2" value={jobTags} onChange={(e) => setJobTags(e.target.value.split(','))} />
                        <FormControl type="text" placeholder="Keywords" className="mr-sm-2" value={keywords} onChange={(e) => setKeywords(e.target.value)} />
                        <Button variant="outline-success" type="submit">Search</Button>
                    </Form>
                </Container>
            </Navbar>
            <Container>
                <Row>
                    {jobPostings.map((jobPosting) => (
                        <Col md={4} key={jobPosting._id}>
                            <Card style={{ marginBottom: '20px' }}>
                                <Card.Body>
                                    <Card.Title>{jobPosting.jobTitle}</Card.Title>
                                    <Card.Text>{jobPosting.jobDescription}</Card.Text>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroupItem>Location: {jobPosting.location}</ListGroupItem>
                                    <ListGroupItem>Salary: {jobPosting.salary}</ListGroupItem>
                                    <ListGroupItem>Job Tags: {jobPosting.jobTags.join(', ')}</ListGroupItem>
                                </ListGroup>
                                <Card.Body>
                                    <Button variant="primary" onClick={() => handleApplyJob(jobPosting._id)}>Apply</Button>
                                </Card.Body>
                            </Card>
                            <div id={`applyForm-${jobPosting._id}`} style={{ display: 'none' }}>
                                <Form onSubmit={(event) => handleSubmitApplication(event, jobPosting._id)}>
                                    <Form.Group controlId={`jobPostingId-${jobPosting._id}`} hidden>
                                        <Form.Control type="text" name="jobPostingId" value={jobPosting._id} readOnly />
                                    </Form.Group>
                                    <Form.Group controlId={`resume-${jobPosting._id}`}>
                                        <Form.Label>Resume</Form.Label>
                                        <Form.Control type="file" name="resumeUrl" required />
                                    </Form.Group>
                                    <Form.Group controlId={`coverMessage-${jobPosting._id}`}>
                                        <Form.Label>Cover Message</Form.Label>
                                        <Form.Control type="text" name="coverMessage" required />
                                    </Form.Group>
                                    <Button type="submit">Submit Application</Button>
                                </Form>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default StudentDashboard;
