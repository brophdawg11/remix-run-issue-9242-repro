import { type MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return (
    <div className="flex items-center justify-center">
      <h1 className="text-4xl">Index</h1>
    </div>
  );
}
