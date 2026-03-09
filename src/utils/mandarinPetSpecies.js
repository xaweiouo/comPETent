export const mandarinPetSpecies=(pet)=>{
  const species={
    dog:'狗',
    cat:'貓',
    bird:'鳥',
    fish:'魚',
    rabbit:'兔',
    rodent:'鼠',
    reptiles:'爬蟲',
    others:'其他',
  };
  return species[pet];
}