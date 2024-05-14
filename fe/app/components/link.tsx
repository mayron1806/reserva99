import { cn } from "~/lib/utils";

const Link = (props: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>) => {
  return ( 
    <a {...props} className={cn('text-sm text-primary underline transition hover:text-gray-600', props.className)}/>
  );
}
 
export default Link;