"use client";

import { motion } from "framer-motion";
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
  const { data: members, error } = useSWR<Member[]>("/api/members", fetcher, {
    revalidateOnFocus: true, 
  });

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
    const colors: Record<
      string,
      { stripe: string; badge: string; accent: string; border: string }
    > = {
      blue: {
        stripe: "from-blue-500/80 to-cyan-500/80",
        badge: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
        accent: "text-blue-600 dark:text-blue-300",
        border: "border-blue-500/20",
      },
      emerald: {
        stripe: "from-emerald-500/80 to-teal-500/80",
        badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        accent: "text-emerald-600 dark:text-emerald-300",
        border: "border-emerald-500/20",
      },
      indigo: {
        stripe: "from-indigo-500/80 to-sky-500/80",
        badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
        accent: "text-indigo-600 dark:text-indigo-300",
        border: "border-indigo-500/20",
      },
      purple: {
        stripe: "from-fuchsia-500/80 to-purple-500/80",
        badge: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
        accent: "text-purple-600 dark:text-purple-300",
        border: "border-purple-500/20",
      },
      orange: {
        stripe: "from-orange-500/80 to-amber-500/80",
        badge: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
        accent: "text-orange-600 dark:text-orange-300",
        border: "border-orange-500/20",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <section id="members" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-bold text-center mb-12 gradient-text"
          >
            Executive Leadership
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {executiveTeam.map((member, index) => (
                <motion.div
                  key={member._id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="glass-card rounded-2xl p-5 border border-white/10 h-full"
                >
                <div className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-300 mb-3">
                  Executive Lead
                </div>
                <div className="relative mb-4">
                  <img
                    src={member.image || "/placeholder.svg"}
                    loading="lazy"
                    alt={member.name}
                    className="w-full aspect-square rounded-xl object-cover"
                  />
                </div>
                <h4 className="text-lg font-semibold mb-1 text-foreground">
                  {member.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Departments */}
        <div className="space-y-16 max-w-6xl mx-auto">
          {departments.map((dept, deptIndex) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + deptIndex * 0.2 }}
                className="relative"
              >
              <div className={`glass-card rounded-3xl border overflow-hidden ${getColorClasses(dept.color).border}`}>
                <div
                  className={`h-1 w-full bg-gradient-to-r ${getColorClasses(
                    dept.color
                  ).stripe}`}
                />
                <div className="p-5 md:p-7">
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-2xl font-bold text-foreground">
                      {dept.name}
                    </h3>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${getColorClasses(
                        dept.color
                      ).badge}`}
                    >
                      <Users className="h-4 w-4" />
                      <span>
                        {dept.members.length + (dept.lead ? 1 : 0)} Members
                      </span>
                    </div>
                  </div>

                  {dept.lead && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + deptIndex * 0.1,
                      }}
                      className="mb-6"
                    >
                      <motion.div
                        whileHover={{ y: -4 }}
                        className={`glass-card rounded-2xl p-5 border ${getColorClasses(dept.color).border}`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-4 items-center">
                          <img
                            src={dept.lead.image || "/placeholder.svg"}
                            loading="lazy"
                            alt={dept.lead.name}
                            className="w-full sm:w-[170px] aspect-square rounded-xl object-cover"
                          />
                          <div className="min-w-0">
                            <p
                              className={`inline-flex rounded-full px-3 py-1 text-xs uppercase tracking-wider mb-3 ${getColorClasses(
                                dept.color
                              ).badge}`}
                            >
                              Department Lead
                            </p>
                            <h4 className="text-xl font-semibold text-foreground truncate">
                              {dept.lead.name}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate mb-3">
                              {dept.lead.role}
                            </p>
                            <p className="text-sm text-foreground/85">
                              Leading {dept.name} with focus on execution, mentoring, and quality outcomes.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + deptIndex * 0.1 }}
                  >
                    {dept.members.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                        {dept.members.map((member) => (
                          <motion.div
                            key={member._id}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.35 }}
                            whileHover={{ y: -4 }}
                            className="glass-card rounded-2xl p-3 border border-white/10 h-full w-full "
                          >
                            <div className="mb-3 flex justify-center">
                              <img
                                src={member.image || "/placeholder.svg"}
                                loading="lazy"
                                alt={member.name}
                                className="w-[170px] h-[170px] rounded-xl object-cover"
                              />
                            </div>
                            <h5 className="text-sm font-semibold text-foreground truncate mb-1 text-center">
                              {member.name}
                            </h5>
                            <p className="text-xs text-muted-foreground truncate text-center">
                              {member.role}
                            </p>
                            <p className={`text-xs mt-3 text-center ${getColorClasses(dept.color).accent}`}>
                              {dept.name}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-white/20 p-5 text-sm text-muted-foreground text-center">
                        No additional team members listed yet.
                      </div>
                    )}
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
