import React, { useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Form, ListGroup, Alert } from "react-bootstrap";
import { AuthContext } from "../context/AuthCont";
import axios from "axios";
import { API } from "../utils/api"; // ✅ import API
import "../styles/Profile.css";

const Profile = () => {
  const { user, isLoggedIn, logout } = useContext(AuthContext);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [shareEmails, setShareEmails] = useState({});
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const navigate = useNavigate();

  const handleAlert = (variant, message) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => setAlert({ show: false, variant: "", message: "" }), 3000);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.email) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", user.email);

    try {
      await axios.post(`${API}/upload`, formData); // ✅ using API
      handleAlert("success", "File uploaded successfully");
      fetchDocuments();
    } catch (err) {
      console.error("Upload failed:", err);
      handleAlert("danger", "Upload failed");
    }
  };

  const fetchDocuments = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`${API}/upload/documents?email=${user.email}`); // ✅
      setUploadedDocs(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const shareDocument = async (docId) => {
    const targetEmail = shareEmails[docId];
    if (!targetEmail) return handleAlert("warning", "Enter an email to share with");

    try {
      await axios.post(`${API}/upload/share`, { docId, targetEmail }); // ✅
      handleAlert("success", "Document shared!");
    } catch (err) {
      console.error("Share error:", err);
      handleAlert("danger", "Failed to share document");
    }
  };

  const deleteDocument = async (docId) => {
    try {
      await axios.delete(`${API}/upload/${docId}`, {
        data: { email: user.email }
      });
      handleAlert("info", "Document removed from your list");
      fetchDocuments();
    } catch (err) {
      const msg = err.response?.data?.error || "Delete failed";
      console.error("Delete error:", msg);
      handleAlert("danger", msg);
    }
  };

  if (!isLoggedIn || !user) {
    return (
      <Container className="profile-container">
        <Card className="profile-card text-center p-4">
          <h5>You must be logged in to view this page.</h5>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="profile-container">
      {alert.show && (
        <Alert className="alert-box" variant={alert.variant}>
          {alert.message}
        </Alert>
      )}

      <Card className="profile-card mb-4 shadow">
        <Card.Body>
          <Card.Title className="profile-title">Profile</Card.Title>
          <Card.Text className="profile-info">
            <strong>Username:</strong> {user.username}
          </Card.Text>
          <Card.Text className="profile-info">
            <strong>Email:</strong> {user.email}
          </Card.Text>
          <Button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
            Logout
          </Button>
        </Card.Body>
      </Card>

      <Card className="profile-card mb-4 shadow">
        <Card.Body>
          <Card.Title className="profile-title">Upload Document</Card.Title>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Control type="file" onChange={handleFileChange} />
          </Form.Group>
          <Button className="upload-btn" onClick={handleUpload}>
            Upload
          </Button>
        </Card.Body>
      </Card>

      <Card className="profile-card shadow">
        <Card.Body>
          <Card.Title className="profile-title">Your Documents</Card.Title>
          {uploadedDocs.length === 0 ? (
            <p>No documents uploaded or shared yet.</p>
          ) : (
            <ListGroup>
              {uploadedDocs.map((doc) => {
                const uploadedByMe = doc.uploadedBy?.email === user.email;
                const sharedByName = doc.uploadedBy?.username;

                return (
                  <ListGroup.Item key={doc._id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <a
                        className="file-link"
                        href={`${API}/${doc.path}`} // ✅ API-based file link
                        target="_blank"
                        rel="noreferrer"
                      >
                        {doc.filename}
                      </a>
                      <Button
                        className="remove-btn"
                        size="sm"
                        onClick={() => deleteDocument(doc._id)}
                      >
                        {uploadedByMe ? "Delete" : "Remove"}
                      </Button>
                    </div>

                    {!uploadedByMe && sharedByName && (
                      <div className="shared-by-label">
                        Shared by: <strong>{sharedByName}</strong>
                      </div>
                    )}

                    <Form className="d-flex mt-2">
                      <Form.Control
                        type="email"
                        placeholder="Enter email to share"
                        onChange={(e) =>
                          setShareEmails({
                            ...shareEmails,
                            [doc._id]: e.target.value,
                          })
                        }
                      />
                      <Button
                        className="share-btn ms-2"
                        onClick={() => shareDocument(doc._id)}
                      >
                        Share
                      </Button>
                    </Form>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;
