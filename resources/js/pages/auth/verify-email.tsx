// Components
import TextLink from '@/components/text-link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';
import { CheckCircle2, Mail, MailCheck } from 'lucide-react';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const isLinkSent = status === 'verification-link-sent';

    return (
        <AuthLayout
            title="Verify your email"
            description="We've sent a verification link to your email address"
        >
            <Head title="Email verification" />

            <div className="space-y-6">
                {/* Success Alert */}
                {isLinkSent && (
                    <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                        <CheckCircle2 className="size-4 text-green-600 dark:text-green-400" />
                        <AlertTitle>Verification email sent!</AlertTitle>
                        <AlertDescription>
                            A new verification link has been sent to your email
                            address. Please check your inbox and click the link
                            to verify your account.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Main Card */}
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="size-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">
                            Check your email
                        </CardTitle>
                        <CardDescription className="text-base">
                            We've sent a verification link to your email
                            address. Please click the link in the email to
                            verify your account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Instructions */}
                        <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-sm font-semibold text-primary">
                                        1
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Check your inbox
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Look for an email from us with the
                                        subject "Verify Email Address"
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-sm font-semibold text-primary">
                                        2
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Click the verification link
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        The link will verify your email address
                                        and activate your account
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                    <span className="text-sm font-semibold text-primary">
                                        3
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium">
                                        Start shopping!
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Once verified, you'll have full access
                                        to your account
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Resend Form */}
                        <Form
                            action={send.url()}
                            method="post"
                            className="space-y-4"
                        >
                            {({ processing }) => (
                                <>
                                    <div className="text-center text-sm text-muted-foreground">
                                        <p className="mb-4">
                                            Didn't receive the email? Check your
                                            spam folder or resend the
                                            verification link.
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                        variant="outline"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner className="mr-2" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <MailCheck className="mr-2 size-4" />
                                                Resend verification email
                                            </>
                                        )}
                                    </Button>
                                </>
                            )}
                        </Form>

                        {/* Logout Link */}
                        <div className="pt-4 text-center">
                            <TextLink
                                href={logout()}
                                className="text-sm text-muted-foreground"
                            >
                                Log out
                            </TextLink>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AuthLayout>
    );
}
