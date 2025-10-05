"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import useSWR from "swr";
import { Users } from "lucide-react";

type Member = {
  _id: string;
  name: string;
  role: string;
  department: string;
  image: string;
  isHead: boolean;
};

type Department = {
  name: string;
  lead: Member | null;
  members: Member[];
  color: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Members() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const { data: members, error } = useSWR<Member[]>("/api/members", fetcher, {
    revalidateOnFocus: true, // updates if user comes back to page
  });

  // Handle loading/error
  if (!members) return <p className="text-center mt-10">Loading members...</p>;
  if (error)
    return <p className="text-center mt-10">Failed to load members.</p>;

  const executiveTeam = members.filter(
    (m) => m.department === "Core Leadership"
  );

  const groupedDepartments: Record<
    string,
    { name: string; lead: Member | null; members: Member[] }
  > = members
    .filter((m) => m.department !== "Core Leadership")
    .reduce((acc, member) => {
      const deptName = member.department || "Uncategorized";
      if (!acc[deptName])
        acc[deptName] = { name: deptName, lead: null, members: [] };
      if (member.isHead) acc[deptName].lead = member;
      else acc[deptName].members.push(member);
      return acc;
    }, {} as Record<string, { name: string; lead: Member | null; members: Member[] }>);

  const departmentColors = ["blue", "emerald", "indigo", "purple", "orange"];
  const departments: Department[] = Object.values(groupedDepartments).map(
    (dept, i) => ({
      ...dept,
      color: departmentColors[i % departmentColors.length],
    })
  );

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400",
      emerald:
        "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
      indigo:
        "border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400",
      purple:
        "border-purple-500/30 bg-purple-500/5 text-purple-600 dark:text-purple-400",
      orange:
        "border-orange-500/30 bg-orange-500/5 text-orange-600 dark:text-orange-400",
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="members" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Meet Our <span className="gradient-text">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Passionate individuals driving innovation and fostering a
            collaborative learning environment
          </p>
        </motion.div>

        {/* Executive Team */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-bold text-center mb-12 gradient-text"
          >
            Executive Leadership
          </motion.h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {executiveTeam.map((member, index) => (
              <motion.div
                key={member._id}
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }
                }
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -6 }}
                className="glass-card rounded-2xl p-6 text-center group cursor-pointer relative overflow-hidden"
              >
                <div className="relative mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-28 h-28 rounded-full mx-auto object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xl font-semibold mb-1 text-foreground">
                  {member.name}
                </h4>
                <p className="text-blue-500 text-sm font-medium">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="space-y-16">
          {departments.map((dept, deptIndex) => (
            <motion.div
              key={dept.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 + deptIndex * 0.2 }}
              className="relative"
            >
              <div
                className={`glass-card rounded-3xl p-5 md:p-6 border-2 ${getColorClasses(
                  dept.color
                )} scale-95`}
              >
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold mb-1 text-foreground">
                    {dept.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-muted-foreground text-sm">
                    <Users className="h-4 w-4" />
                    <span>
                      {dept.members.length + (dept.lead ? 1 : 0)} Members
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-6">
                  {dept.lead && (
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }
                      }
                      transition={{
                        duration: 0.6,
                        delay: 0.1 + deptIndex * 0.1,
                      }}
                      className="md:basis-[32%] lg:basis-[30%]"
                    >
                      <div className="glass-card rounded-2xl p-4 border-2 border-current aspect-square flex flex-col items-center justify-center scale-90 mx-auto">
                        <img
                          src={dept.lead.image || "/placeholder.svg"}
                          alt={dept.lead.name}
                          className="w-36 h-36 rounded-xl object-cover mb-2"
                        />
                        <h4 className="text-base font-semibold text-foreground">
                          {dept.lead.name}
                        </h4>
                        <p className="text-sm font-medium text-current">
                          {dept.lead.role}
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={
                      isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }
                    }
                    transition={{ duration: 0.6, delay: 0.2 + deptIndex * 0.1 }}
                    className="md:basis-[68%] lg:basis-[70%]"
                  >
                    <div className="grid grid-cols-3 gap-3 scale-95 items-stretch">
                      {dept.members.slice(0, 6).map((member) => (
                        <motion.div
                          key={member._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={
                            isInView
                              ? { opacity: 1, scale: 1 }
                              : { opacity: 0, scale: 0.9 }
                          }
                          transition={{ duration: 0.4 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          className="glass-card rounded-xl p-4 text-center min-h-[170px] flex flex-col justify-center"
                        >
                          <img
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
                          />
                          <h5 className="text-sm font-semibold text-foreground">
                            {member.name}
                          </h5>
                          <p className="text-xs text-current">{member.role}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
