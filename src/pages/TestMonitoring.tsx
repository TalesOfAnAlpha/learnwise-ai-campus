
import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Import refactored components
import MonitoringHeader from '@/components/test-monitoring/MonitoringHeader';
import SetupInstructions from '@/components/test-monitoring/SetupInstructions';
import ActiveMonitoring from '@/components/test-monitoring/ActiveMonitoring';
import { useTestMonitoring } from '@/hooks/useTestMonitoring';

const TestMonitoring: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
    cameraEnabled,
    micEnabled,
    testStarted,
    timeRemaining,
    loading,
    faceDetected,
    faceCount,
    warnings,
    currentQuestion,
    totalQuestions,
    progress,
    suspiciousActivities,
    isVisible,
    tabSwitchCount,
    tabSwitches,
    handleFaceDetection,
    requestCameraAccess,
    requestMicAccess,
    handleStartTest,
    handleEndTest,
    handleDismissWarning
  } = useTestMonitoring();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const onEndTest = async () => {
    const success = await handleEndTest();
    if (success) {
      // Navigate to results page (would be implemented in a real app)
      navigate('/courses');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="border-2 border-gray-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
            <MonitoringHeader 
              testStarted={testStarted} 
              timeRemaining={timeRemaining} 
            />
          </CardHeader>
          <CardContent className="p-6">
            {testStarted ? (
              <ActiveMonitoring 
                progress={progress}
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                timeRemaining={timeRemaining}
                cameraEnabled={cameraEnabled}
                micEnabled={micEnabled}
                isVisible={isVisible}
                faceDetected={faceDetected}
                faceCount={faceCount}
                handleFaceDetection={handleFaceDetection}
                handleEndTest={onEndTest}
                loading={loading}
                warnings={warnings}
                handleDismissWarning={handleDismissWarning}
                suspiciousActivities={suspiciousActivities}
                tabSwitchCount={tabSwitchCount}
                tabSwitches={tabSwitches}
              />
            ) : (
              <SetupInstructions 
                cameraEnabled={cameraEnabled}
                micEnabled={micEnabled}
                requestCameraAccess={requestCameraAccess}
                requestMicAccess={requestMicAccess}
                handleStartTest={handleStartTest}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TestMonitoring;
