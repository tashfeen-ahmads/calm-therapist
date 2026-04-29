interface StyleProps {
  children: string;
}

/**
 * Wrapper around <style> that uses dangerouslySetInnerHTML so characters like
 * `>` don't trigger React hydration mismatches.
 */
export function Style({ children }: StyleProps) {
  return <style dangerouslySetInnerHTML={{ __html: children }} />;
}
