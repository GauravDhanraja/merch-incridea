"use client";

import Image from "next/image";
import {
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaBehanceSquare,
} from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";
import { RiDoubleQuotesR } from "react-icons/ri";

type TeamCardProps = {
  name: string;
  role: string;
  image: string;
  description?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  behance?: string;
};

const TeamCard = ({
  name,
  role,
  image,
  description,
  linkedin,
  github,
  instagram,
  behance,
}: TeamCardProps) => {
  return (
    <div className="w-80 rounded-2xl border bg-palate_3 px-4 py-4 text-center shadow-lg">
      <div
        className="pb-full relative w-full overflow-hidden rounded-xl"
        style={{ paddingBottom: "100%" }}
      >
        <Image src={image} alt={name} layout="fill" className="object-cover" />
      </div>

      <h2 className="mt-4 text-2xl font-bold text-palate_2">{name}</h2>
      <p className="text-lg font-bold text-palate_2">{role}</p>

      <div className="mt-4 flex justify-center gap-4">
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800"
          >
            <FaLinkedin size={24} />
          </a>
        )}
        {behance && (
          <a
            href={behance}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-gray-700"
          >
            <FaBehanceSquare size={24} />
          </a>
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 hover:text-gray-700"
          >
            <FaGithub size={24} />
          </a>
        )}
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pink-600 hover:text-pink-800"
        >
          <FaInstagram size={24} />
        </a>
      </div>
      <div className="mt-6 flex flex-col px-2">
        <RiDoubleQuotesL className="size-6" />
        {description && (
          <p className="px-2 text-lg font-semibold text-palate_2">{description}</p>
        )}
        <RiDoubleQuotesR className="size-6 self-end" />
      </div>
    </div>
  );
};

export default TeamCard;
