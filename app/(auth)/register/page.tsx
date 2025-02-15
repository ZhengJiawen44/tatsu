"use server";
import Link from "next/link";
import Image from "next/image";
const page = () => {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const formObject = Object.fromEntries(formData.entries());

      console.log(formObject);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formObject),
      });

      const body = await res.json();
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="flex min-w-screen min-h-screen justify-center items-center">
      <form className="w-[38%] h-fit bg-form-background rounded-lg p-[85px]">
        {/* header */}
        <h1 className="text-[45px] text-white mb-[37px]">Create an account</h1>
        <p className="text-[14px] text-form-muted mb-[40px]">
          Already have an account?
          <Link
            href="/login"
            className="underline text-form-link hover:text-form-link-accent ml-1"
          >
            Login
          </Link>
        </p>

        {/* form fields */}
        <div
          id="formFieldContainer"
          className="flex flex-col gap-[43px] mb-[50px]"
        >
          <div id="nameFieldContainer" className="flex gap-5">
            <input
              type="text"
              className="bg-form-input rounded-md h-[45px] w-[50%] px-[18px] focus:outline-none focus:outline-form-border"
              placeholder="First Name*"
            ></input>
            <input
              type="text"
              className="bg-form-input rounded-md h-[45px] w-[50%] px-[18px] focus:outline-none focus:outline-form-border"
              placeholder="Last Name"
            ></input>
          </div>
          <input
            type="text"
            className="bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
            placeholder="Email"
          ></input>
          <input
            type="text"
            className="bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
            placeholder="Enter your password"
          ></input>
          <input
            type="text"
            className="bg-form-input rounded-md h-[45px] w-full px-[18px] focus:outline-none focus:outline-form-border"
            placeholder="Confirm your password"
          ></input>
        </div>

        {/* create button, Oauth button */}
        <div id="formActions" className="flex flex-col gap-5">
          <button className="bg-form-button rounded-md text-white px-[18px] py-[10px] w-full">
            Create Account
          </button>
          <p className="m-auto w-fit">or Register with</p>
          <div id="OauthContainer" className="flex gap-5">
            <button
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md"
            >
              <Image
                src="google.svg"
                alt="apple"
                width={28}
                height={28}
                priority={false}
              />
              <p className="text-white">Google</p>
            </button>
            <button
              type="button"
              className="flex gap-3 justify-center items-center w-1/2 h-[3rem] border border-form-border rounded-md"
            >
              <Image
                src="apple.svg"
                alt="apple"
                width={28}
                height={28}
                priority={false}
              />
              <p className="text-white">Apple</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default page;

{
  /* <form
className="flex flex-col p-8 rounded-lg bg-card w-fit gap-4 m-auto mt-40"
onSubmit={handleSubmit}
>
<label>Email</label>
<input name="email" type="email" />

<label>Password</label>
<input name="password" type="password" />

<button className="border" type="submit">
  register
</button>
</form> */
}
