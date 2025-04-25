export const fetchContacts = async () => {
    const response = await fetch(
      "https://randomuser.me/api/?results=100&seed=fullstackio"
    );
    const { results } = await response.json();
  
    return results.map((user) => ({
      name: `${user.name.first} ${user.name.last}`,
      phone: user.phone,
      cell: user.cell,
      email: user.email,
      avatar: user.picture.large,
      favorite: Math.random() < 0.3, // Randomly mark some as favorites
    }));
  };
  
  export const fetchUserContact = async () => {
    const response = await fetch("https://randomuser.me/api/?seed=fullstackio");
    const { results } = await response.json();
    const user = results[0];
  
    return {
      name: `${user.name.first} ${user.name.last}`,
      phone: user.phone,
      cell: user.cell,
      email: user.email,
      avatar: user.picture.large,
    };
  };
  
  export const fetchRandomContact = async () => {
    const response = await fetch("https://randomuser.me/api/");
    const { results } = await response.json();
    const user = results[0];
  
    return {
      name: `${user.name.first} ${user.name.last}`,
      phone: user.phone,
      cell: user.cell,
      email: user.email,
      avatar: user.picture.large,
    };
  };