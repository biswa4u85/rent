"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { InputBox, PasswordBox, Buttons } from "@/components/RenderFroms";
import { Formik } from "formik";
import * as Yup from "yup";
import { MdOutlineMail } from "react-icons/md";
import { signIn } from "next-auth/react";
import { toast } from 'react-toastify';

const Page: React.FC = (props: any) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const onPressHandle = async (values: any) => {
    setLoading(true)
    const res: any = await signIn("credentials", { ...values, redirect: false })
    if (res.error) {
      toast.error("Double-check that your email and password are entered correctly")
    } else {
      router.push("/admin");
    }
    setLoading(false)
  };

  return (
    <Formik
      initialValues={{ email: "a1@demo.com", password: "Demo@123" }}
      validationSchema={validationSchema}
      onSubmit={(values) => onPressHandle(values)}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <div className="bg-white">
          <div className="flex items-center justify-center h-screen">
            <div className="bg-white border rounded-sm lg:w-1/4 sm:w-2/4 border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="w-full p-4">
                <Link className="mb-5.5 flex justify-center items-center" href="/">
                  <Image
                    className="hidden dark:block"
                    src={"/images/Logo.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                  <Image
                    className="dark:hidden"
                    src={"/images/Logo.svg"}
                    alt="Logo"
                    width={176}
                    height={32}
                  />
                </Link>
                <div className="mb-4">
                  <InputBox
                    error={errors.email}
                    label="Email"
                    placeholder="Enter your email"
                    icon={<MdOutlineMail />}
                    name="email"
                  />
                </div>
                <div className="mb-4">
                  <PasswordBox
                    error={errors.password}
                    label="Password"
                    placeholder="Enter your Password"
                    name="password"
                  />
                </div>
                <div className="mb-4">
                  <Buttons value={"Sign In"} loading={loading} onClick={handleSubmit} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Page;
