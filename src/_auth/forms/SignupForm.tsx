import { Button } from "../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { SignupValidation } from "../../lib/validation";
import { z } from 'zod';
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { useCreateUserAccountMutation, useSignInAccountMutation } from "../../lib/react-query/queriesAndMutations";
import { useUserContext } from "../../context/AuthContext";
import Loader from "../../components/ui/shared/Loader";

const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccountMutation();
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccountMutation();

  // Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      email: '',
    },
  });

  // Define a submit handler.
  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    try {
      // Check if a user is already authenticated
      const isLoggedIn = await checkAuthUser();
      
      if (isLoggedIn) {
        form.reset();
        navigate('/');
        return;
      }
  
      // Create a new user account
      const newUser = await createUserAccount(values);
      if (!newUser) {
        return toast({ title: 'Sign up failed. Please try again.' });
      }
  
      // Sign in the user
      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });
      if (!session) {
        return toast({ title: 'Sign in failed. Please try again.' });
      }
  
      // Check if the user is authenticated after sign-in
      const stillLoggedIn = await checkAuthUser();
      if (stillLoggedIn) {
        form.reset();
        navigate('/');
      } else {
        return toast({ title: 'Sign up failed. Please try again.' });
      }
    } catch (error) {
      console.error('Error during sign up or sign in:', error);
      toast({ title: 'An unexpected error occurred. Please try again.' });
    }
  };
  
  

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src='/public/assets/images/logo.svg' alt="Logo" />
        <h2 className="h3-bold pt-5 sm:pt-12 md:h2-bold">Create a new account</h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Snapgram, please enter your details
        </p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isCreatingUser ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : 'Sign Up'}
          </Button>

          <p className="text-small-regular text-light-2 text-center mt-2">
            Already have an account? 
            <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1">Log In</Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignupForm;
