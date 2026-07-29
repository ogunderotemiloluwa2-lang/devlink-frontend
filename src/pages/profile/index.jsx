import { useParams, Link } from "react-router-dom";
import { UserX } from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import EmptyState from "@/components/states/EmptyState";
import BackButton from "@/components/layout/BackButton";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useApi";
import { adaptProfile } from "@/lib/utils";

export default function Profile() {
  const { username } = useParams();
  const { data: rawProfile, loading, error } = useProfile(username);
  const profile = adaptProfile(rawProfile);

  if (loading) {
    return (
      <div className="container max-w-4xl py-8">
        <BackButton href="/dashboard" className="mb-4" />
        <div className="animate-pulse space-y-4">
          <div className="h-24 w-24 rounded-full bg-muted" />
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container max-w-4xl py-16">
        <BackButton href="/dashboard" className="mb-4" />
        <EmptyState
          icon={UserX}
          title="Profile not found"
          description={`There's no DevLink profile at @${username}. It may have been removed or the link is incorrect.`}
          action={
            <Button variant="outline" asChild size="sm">
              <Link to="/dashboard">Back to dashboard</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <BackButton href="/dashboard" className="mb-4" />
      <ProfileHeader profile={profile} />
      <ProfileTabs profile={profile} />
    </div>
  );
}
