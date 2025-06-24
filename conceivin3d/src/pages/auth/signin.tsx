import { getProviders, signIn } from "next-auth/react";
import { GetServerSideProps } from "next";

export default function SignIn({ providers }) {
  return (
    <div>
      <h1>Sign In</h1>
      <div>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  return {
    props: { providers },
  };
};