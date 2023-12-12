"use client"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Image from "next/image";
import { Formik } from "formik";
import * as Yup from "yup";
import { toast } from 'react-toastify';
import { InputBox, FileBox, Buttons } from "@/components/RenderFroms";
import { useSession } from "next-auth/react";
import { useFetchSingle } from "@/contexts/useFetchSingle";
import { usePatch } from "@/contexts/usePatch";
import { FaUser, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const resource = "users";

const Settings = () => {
  const { data }: any = useSession()
  const { edit, data: respond, loading: editoading } = usePatch();
  const { data: user, loading } = useFetchSingle({ url: resource, query: { id: data?.user?.id } });

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string().required("Phone is required"),
  });

  const validationSchemaProfile = Yup.object().shape({
    image: Yup.string().required("Profile required"),
  });

  const handleUpdate = (body: any) => {
    edit(resource, { ...body })
  }
  if (respond) {
    toast.success(`Profile update successfully`);
  }

  if (loading) {
    return "loading..."
  }

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Settings" />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-4 border-b border-stroke px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Personal Information
                </h3>
              </div>
              <Formik
                initialValues={{ ...user }}
                validationSchema={validationSchema}
                onSubmit={(values) => handleUpdate(values)}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                  <div className="p-7">
                    <form action="#">
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2">
                          <InputBox
                            required={true}
                            name="firstName"
                            label="First Name"
                            placeholder="Enter your First Name"
                            icon={<FaUser />}
                          />
                        </div>

                        <div className="w-full sm:w-1/2">
                          <InputBox
                            required={true}
                            name="lastName"
                            label="Last Name"
                            placeholder="Enter your Last Name"
                            icon={<FaUser />}
                          />
                        </div>
                      </div>

                      <div className="mb-5.5">
                        <InputBox
                          required={true}
                          readOnly={true}
                          name="email"
                          label="Email"
                          placeholder="Enter your Email"
                          icon={<MdEmail />}
                        />
                      </div>

                      <div className="mb-5.5">
                        <InputBox
                          required={true}
                          name="phone"
                          label="Phone"
                          placeholder="Enter your Phone"
                          icon={<FaPhoneAlt />}
                        />
                      </div>
                      <div className="flex justify-end gap-4.5">
                        <Buttons value={"Save"} loading={editoading} onClick={handleSubmit} />
                      </div>
                    </form>
                  </div>
                )}
              </Formik>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="py-4 border-b border-stroke px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Your Photo
                </h3>
              </div>
              <div className="p-7">
                <Formik
                  initialValues={user}
                  validationSchema={validationSchemaProfile}
                  onSubmit={(values) => handleUpdate(values)}
                >
                  {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-full h-14 w-14">
                          <Image
                            src={values?.image ? values.image : "/images/user.png"}
                            width={55}
                            height={55}
                            alt="User"
                          />
                        </div>
                        <div>
                          <span className="mb-1.5 text-black dark:text-white">
                            Edit your photo
                          </span>
                        </div>
                      </div>
                      <FileBox
                        required={true}
                        name="image"
                        label="Profile"
                        placeholder="Upload Profile"
                      />
                      <div className="mt-5"><Buttons value={"Save"} loading={editoading} onClick={handleSubmit} /></div>
                    </>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default Settings;
