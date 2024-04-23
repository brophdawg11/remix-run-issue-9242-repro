import { redirect, type ActionFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Form, Link, useActionData } from '@remix-run/react';

import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { EmailSchema, PasswordSchema } from '~/lib/rules';
import { z } from 'zod';

import { Divider } from '~/components/divider';
import { Spacer } from '~/components/spacer';
import { Button } from '~/components/ui/button';
import { CheckboxField, Field } from '~/components/ui/form';

export const meta: MetaFunction = () => {
  return [{ title: 'Sign In' }];
};

const schema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  rememberMe: z.string().optional().transform(Boolean),
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, { schema });

  // Send the submission back to the client if the status is not successful
  if (submission.status !== 'success') {
    return submission.reply();
  }

  const session = null;

  if (!session) {
    return submission.reply({
      formErrors: ['Incorrect username or password'],
    });
  }

  return redirect('/');
}

export default function SignInRoute() {
  const lastResult = useActionData<typeof action>();

  // The useForm hook will return all the metadata we need to render the form
  // and put focus on the first invalid field when the form is submitted
  const [form, fields] = useForm({
    // This not only syncs the error from the server
    // But is also used as the default value of the form
    // in case the document is reloaded for progressive enhancement
    lastResult,
    onValidate({ formData }) {
      // Run the same validation logic on client
      return parseWithZod(formData, { schema });
    },
    constraint: getZodConstraint(schema),
    // Validate field once user leaves the field
    shouldValidate: 'onBlur',
    // Then, revalidate field as user types again
    shouldRevalidate: 'onInput',
  });

  return (
    <div className="flex min-h-full flex-col justify-center pb-32 pt-20">
      <div className="flex flex-col gap-3 text-center">
        <h1 className="text-h1 text-4xl font-bold">Welcome back!</h1>
        <p className="text-body-md text-muted-foreground">Sign in to your account.</p>
      </div>
      <Spacer size="xs" />
      <Form method="post" {...getFormProps(form)} className="mx-auto w-full max-w-md px-8 py-2">
        <div className="flex flex-col gap-4">
          <Button type="submit" className="w-full">
            {/*            <Icon name="github" size="font" className="mr-2" />
             */}
            Continue with GitHub
          </Button>
          <Button type="submit" className="w-full">
            {/*<Icon name="google" size="font" className="mr-2" /> */}
            Continue with Google
          </Button>
        </div>

        <Divider />

        <Field
          labelProps={{ children: 'Email' }}
          inputProps={{
            ...getInputProps(fields.email, {
              type: 'email',
            }),
            autoFocus: true,
          }}
          errors={fields.email.errors}
        />
        <Field
          labelProps={{ children: 'Password' }}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'current-password',
          }}
          errors={fields.password.errors}
        />
        <div className="flex justify-between">
          <CheckboxField
            labelProps={{
              children: 'Remember me',
            }}
            buttonProps={getInputProps(fields.rememberMe, {
              type: 'checkbox',
            })}
            errors={fields.rememberMe.errors}
          />
          <div className="flex justify-between">
            <Link to="/forgot-password" className="text-body-xs font-semibold">
              Forgot password?
            </Link>
          </div>
        </div>
        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <div className="flex justify-center py-2 text-sm font-semibold text-destructive">{form.errors}</div>
        <hr className="my-8 text-sky-500" />
      </Form>
      <div className="flex items-center justify-center gap-2">
        <span className="text-muted-foreground">Don&apos;t have an account?</span>
        <Link to="/sign-up" className="text-body-xs font-semibold underline">
          Sign Up Now
        </Link>
      </div>
    </div>
  );
}
