import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import "tailwindcss/tailwind.css";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

type Country = {
  flag_url: string;
  name_ru: string;
  iso_code2: string;
  iso_code3: string;
};

export const getServerSideProps = (async () => {
  const res = await fetch(
    "https://gist.githubusercontent.com/sanchezzzhak/8606e9607396fb5f8216/raw/39de29950198a7332652e1e8224f988b2e94b166/ISO3166_RU.json"
  );
  const countries: Country[] = await res.json();

  return {
    props: {
      countries: countries,
    },
  };
}) satisfies GetServerSideProps<{
  countries: Country[];
}>;

const Home: React.FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ countries }) => {
  const [countryList, setCountryList] = useState<Country[]>(countries || []);

  const removeCountry = (countryCode: string) => {
    setCountryList((prev) => prev.filter((c) => c.iso_code3 !== countryCode));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Список стран
        </h1>
        <ul className="space-y-2">
          <AnimatePresence>
            {countryList.map((country) => (
              <motion.li
                key={country.iso_code3}
                layout
                initial={{ opacity: 0, x: -400, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 200, scale: 1.2 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow"
              >
                {country.flag_url && (
                  <div className="flex items-center space-x-4">
                    <Image
                      src={`https:${country.flag_url}`}
                      alt={country.name_ru}
                      width={40}
                      height={30}
                      className="rounded"
                    />
                    <span className="text-lg font-medium text-gray-800">
                      {country.name_ru}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeCountry(country.iso_code3)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                >
                  Удалить
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
};

export default Home;
