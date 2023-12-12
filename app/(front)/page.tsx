import Link from 'next/link'
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SiteApis from "@/contexts/SiteApis";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home Page",
  description: "This is Home page",
};

const getData = async (): Promise<any> => {
  const data: any = await getServerSession(authOptions)
  // const response: any = await SiteApis.getDataApi("projects", {}, data?.token);
  // if (!response?.error) {
  //     return response;
  // }
  return data
};

const Page = async () => {
  const data = await getData();
  return (
    <div className="bg-white">
      <div className="flex items-center justify-center h-screen">
        <div className="w-1/4 bg-white border rounded-sm border-stroke shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="w-full p-4">
            <Link className="m-5.5 flex justify-center items-center" href="/">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;