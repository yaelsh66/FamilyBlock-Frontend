import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { getUsersByFamily } from '../api/firebaseTasks';
import { useCompletions } from '../context/CompletionsContext'; // your completions context
import TaskItem from '../components/TaskItem';



function ParentApprovalPage() {
  const { user, loading } = useAuth();
  const [children, setChildren] = useState([]);
  const [error, setError] = useState('');
  const {
    completions,
    loading: completionsLoading,
    error: completionsError,
    approveCompletion,
    rejectCompletion,
  } = useCompletions();
  


  useEffect(() => {
    if (!user) return;

    const fetchChildren = async () => {
      setError('');
      try {
        const familyChildren = await getUsersByFamily(user.familyId, user.token);
        setChildren(familyChildren);
      } catch (e) {
        setError('Failed to load children');
        console.error(e);
      }
    };

    fetchChildren();
  }, [user]);

  // Group completions by child uid for display
  const completionsByChild = completions.reduce((acc, completion) => {
    const childId = completion.childId;
    if (!acc[childId]) acc[childId] = [];
    acc[childId].push(completion);
    return acc;
  }, {});

  const handleApproval = async (childId, completionId, time, isApproved) => {
    try {
      if (isApproved) {
        await approveCompletion(completionId, childId, time);
      } else {
        await rejectCompletion(completionId, childId, time);
      }
      const familyChildren = await getUsersByFamily(user.familyId, user.token);
      setChildren(familyChildren);
    } catch (err) {
      console.error('Approval error:', err);
      alert('❌ Failed to process task.');
    }
  };

  if (loading || completionsLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (!user || user.role !== 'parent') {
    return (
      <Container className="mt-5">
        <Alert variant="warning">🚫 Please log in as a parent to see this page.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>📝 Pending Tasks for Approval</h2>
      {(error || completionsError) && <Alert variant="danger">{error || completionsError}</Alert>}
      <Row>
        {children.length === 0 && <p>No children found in your family.</p>}
        {children.map((child) => (
          <Col key={child.uid} md={4} className="mb-4">
            <Card>
              
              <Card.Header>{child.nickname || child.email || child.uid}</Card.Header>
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {completionsByChild[child.uid]?.length ? (
                  completionsByChild[child.uid].map((task) => (
                    <div key={task.id} className="mb-3">
                      <TaskItem task={task} />
                      <div className="d-flex justify-content-between mt-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleApproval(child.uid, task.id, task.time, true)
                          }
                        >
                          ✅ Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() =>
                            handleApproval(child.uid, task.id, task.time, false)
                          }
                        >
                          ❌ Reject
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No tasks waiting for approval.</p>
                )}
              </Card.Body>
              <Card.Footer>
                <div>
                  <strong>Total Time:</strong> {child.totalTime || 0} mins
                </div>
                <div>
                  <strong>Pending Time:</strong> {child.pendingTime || 0} mins
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ParentApprovalPage;
