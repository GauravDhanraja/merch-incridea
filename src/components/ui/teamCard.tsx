"use client";

import Image from "next/image";
import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa";

type TeamCardProps = {
  name: string;
  role: string;
  image: string;
  description?: string;
  linkedin?: string;
  github?: string;
  instagram: string;
};

const TeamCard = ({ name, role, image, description, linkedin, github, instagram }: TeamCardProps) => {
  return (
    <div className="border rounded-lg px-4 py-8 shadow-lg text-center w-80 bg-palate_1">
      <div className="relative w-full pb-full rounded-xl overflow-hidden" style={{ paddingBottom: "100%" }}>
        <Image
          src={image}
          alt={name}
          layout="fill"
          className="object-cover"
        />
      </div>

      <h2 className="text-xl font-bold mt-4 text-palate_2">{name}</h2>
      <p className="text-palate_2 font-semibold">{role}</p>
      {description && <p className="text-sm mt-2 text-palate_2">{description}</p>}

      <div className="flex justify-center gap-4 mt-4">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
            <FaLinkedin size={24} />
          </a>
        )}
        {github && (
          <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-900 hover:text-gray-700">
            <FaGithub size={24} />
          </a>
        )}
        <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
          <FaInstagram size={24} />
        </a>
      </div>
    </div>
  );
};

export default TeamCard;
