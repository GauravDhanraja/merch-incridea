import TeamCard from "../../components/ui/teamCard";

const Team = () => {
  const teamMembers = [
    {
      name: "Ashton",
      role: "Developer",
      image: "/team/ashton.jpg",
      linkedin: "https://linkedin.com/in/ashtonmths",
      github: "https://github.com/subtilizer28",
      description: '"your phone linging 📞"',
      instagram: "https://instagram.com/_ashtonmathias_",
    },
    {
      name: "Ishan Shetty",
      role: "Developer",
      image: "/team/ishan.jpg",
      description:'"I am  व्यंजनs 🦇"',
      linkedin: "https://www.linkedin.com/in/ishan-shetty-0a889821a",
      github: "https://github.com/ishan-shetty",
      instagram: "https://instagram.com/ishanshetty_",
    },
    {
      name: "Gaurav Dhanraja",
      role: "Developer",
      image: "",
      description:'"Arch btw,vim btw"',
      linkedin: "https://linkedin.com/in/gauravdhanraja",
      github: "https://github.com/gauravdhanraja",
      instagram: "https://instagram.com/gaurav.dhanraja",
    },
    {
      name: "Keerthan",
      role: "Developer",
      image: "",
      linkedin: "https://www.linkedin.com/in/keetha1011/",
      github: "https://github.com/keetha1011",
      instagram: "https://www.instagram.com/keetha_k11/",
    },
    {
      name: "Nandan R Pai",
      role: "Developer",
      image: "/team/nandan.jpg",
      github: "https://github.com/nandanpi",
      instagram: "https://instagram.com/nandanpi_",
    },
    {
      name: "Aryan Singh",
      role: "Designer",
      image: "/team/aryan.jpg",
      github: "https://github.com/wizhill05",
      instagram: "https://instagram.com/just_aryansingh",
    },
    {
      name: "Mayur Shet",
      role: "Designer",
      image: "",
      instagram: "https://instagram.com/exposure._.studio",
    },
    {
      name: "Pavan C",
      role: "Designer",
      image: "",
      linkedin: "https://www.linkedin.com/in/pavan-c-840821203?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      github: "https://github.com/PACHITRA",
      instagram: "https://www.instagram.com/pavan_chitrapura/",
    }
  ];

  return (
    <div className="absolute w-full min-h-screen flex flex-col items-center bg-palate_2 py-20"> 
      <h1 className="text-3xl font-bold mb-10 text-palate_1">Our Team</h1>
      <div className="flex flex-wrap gap-8 justify-center">
        {teamMembers.map((member, index) => (
          <TeamCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
};

export default Team;
