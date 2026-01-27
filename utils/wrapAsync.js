function wrapAsync(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}
export default wrapAsync;

///wrapAsync kaise kaam krta h chalo smjhte ,wrapAsync function ye ek parameter leta h (aapka main async function jisme aapne code likha h) jo o function h ,phir wrapAsync chalaya to return ek naya function kiya h to ye wrapAsync ke jagah ye aagya ab bhi request aayega to sidha return fnc pe aayga ab iske andar code chalega jo ki mein function jo aap code likh rkhe ho  ,ye iss liye use krte h taaki aap baar baar tryCatch se use krne se bach sko bs wrapAsync aapke main function me add krna h ,,ab aap sochenge ki agar mera main fucntion me trch catch nhi agr koi error aaya to kaise code chalega ,ab naya tric jab aap tryCatch hat aye ye wrapAync krte ho to jab bhi error ayega to aapka function uss error ko throw krega ,aur jaise hi bahar aaya dekha ki us fnc me .catch laga uss me chala jata h isse code ftne se bach jaat h
