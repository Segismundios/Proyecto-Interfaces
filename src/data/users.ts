import { User } from "@/types";

export const currentUser: User = {
  username: "javier-lopez",
  displayName: "Javier Lopez",
  avatarUrl: "https://ui-avatars.com/api/?name=Javier+Lopez&background=238636&color=fff&size=128",
  bio: "Estudiante de Computacion | Universidad Nacional",
};

export const collaborators: User[] = [
  {
    username: "maria-garcia",
    displayName: "Maria Garcia",
    avatarUrl: "https://ui-avatars.com/api/?name=Maria+Garcia&background=1f6feb&color=fff&size=128",
    bio: "Full-stack developer",
  },
  {
    username: "carlos-ruiz",
    displayName: "Carlos Ruiz",
    avatarUrl: "https://ui-avatars.com/api/?name=Carlos+Ruiz&background=a371f7&color=fff&size=128",
    bio: "Backend engineer",
  },
  {
    username: "ana-martinez",
    displayName: "Ana Martinez",
    avatarUrl: "https://ui-avatars.com/api/?name=Ana+Martinez&background=f85149&color=fff&size=128",
    bio: "DevOps & Cloud",
  },
  {
    username: "diego-soto",
    displayName: "Diego Soto",
    avatarUrl: "https://ui-avatars.com/api/?name=Diego+Soto&background=db6d28&color=fff&size=128",
    bio: "Frontend & accesibilidad",
  },
  {
    username: "lucia-fernandez",
    displayName: "Lucia Fernandez",
    avatarUrl: "https://ui-avatars.com/api/?name=Lucia+Fernandez&background=2da44e&color=fff&size=128",
    bio: "QA & testing",
  },
];
