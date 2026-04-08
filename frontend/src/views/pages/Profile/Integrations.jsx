import React, { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter,
} from '@/components/ui/card';
import { ExternalLink, Calendar, BadgeCheck, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { connectToGoogleApi } from '@/apis/integration.api';
import { myDetailsActions } from '@/redux/combineActions';
import { useSelector as useReduxSelector } from 'react-redux';

const Integrations = () => {
  const dispatch = useDispatch();
  const { integrations } = useSelector((state) => state.myDetailsState);
  const { profileDetails } = useReduxSelector((s) => s.userProfileState);
  const { isGoogleConnectedAction } = myDetailsActions;
  const isTeacher = profileDetails?.role === 'teacher';
  const isConnected = integrations?.google?.isGoogleConnected;

  useEffect(() => {
    if (!integrations?.google?.isApiCalled) {
      dispatch(isGoogleConnectedAction());
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar & Meet</CardTitle>
        <CardDescription>
          {isTeacher
            ? 'Connect your Google account to schedule Google Meet sessions for your students directly from the system.'
            : 'Connect Google Calendar to schedule live classes and automatically generate Google Meet links for students.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card className="overflow-hidden transition-all hover:shadow-md max-w-sm">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-start">
              <div className="p-2 bg-muted rounded-md">
                <Calendar className="h-8 w-8" />
              </div>
              <Badge variant="secondary">Required</Badge>
            </div>
            <CardTitle className="mt-4">Google Calendar</CardTitle>
            <CardDescription>
              Enables Google Meet link generation when creating live class sessions.
            </CardDescription>
          </CardHeader>
          <CardFooter className="pt-2 flex flex-col gap-2">
            {isConnected ? (
              <Button className="w-full bg-green-700 hover:bg-green-800">
                <BadgeCheck className="mr-2 h-4 w-4" />
                Connected — Ready to schedule meetings
              </Button>
            ) : (
              <Button className="w-full" onClick={() => connectToGoogleApi()}>
                Connect Google Account
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            )}
            {!isConnected && (
              <p className="text-xs text-muted-foreground text-center">
                You must connect Google before you can create live class sessions with Meet links.
              </p>
            )}
          </CardFooter>
        </Card>

        {isConnected && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <Video className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800">How to create a Google Meet session</p>
                <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                  {isTeacher ? (
                    <>
                      <li>Go to <strong>Homework</strong> page and open a student's record</li>
                      <li>Use the <strong>Mark Attendance</strong> page to create a live class</li>
                      <li>A Google Meet link is auto-generated and emailed to the student</li>
                    </>
                  ) : (
                    <>
                      <li>Go to <strong>Students</strong> and open a student's details</li>
                      <li>Click <strong>Mark Attendance</strong></li>
                      <li>Click <strong>Create Live Class</strong> — a Meet link is auto-generated</li>
                      <li>The student receives the Meet link by email automatically</li>
                    </>
                  )}
                </ol>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(Integrations);
