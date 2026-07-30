import { useState } from "react";
import { Link2, MapPin, Github, Calendar, Users, MessageCircle } from "lucide-react";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/toast";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader({ profile }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [following, setFollowing] = useState(profile.isFollowing || false);
  const [followers, setFollowers] = useState(profile.followersCount || 0);
  const [followingCount, setFollowingCount] = useState(profile.followingCount || 0);
  const [messaging, setMessaging] = useState(false);
  const isOwnProfile = user?.username === profile.username;
  const joinedDate = new Date(profile.joined).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const { toast } = useToast();

  const toggleFollow = async () => {
    try {
      if (following) {
        // Unfollow
        await api.delete(`/follow/${profile.username}`);
        setFollowing(false);
        setFollowers((prev) => prev - 1);
      } else {
        // Follow
        const res = await api.post(`/follow/${profile.username}`);
        const isNowFollowing = res.data.following;
        setFollowing(isNowFollowing);
        if (isNowFollowing) {
          setFollowers((prev) => prev + 1);
        }
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not update follow status.", variant: "destructive" });
    }
  };

  const handleMessage = async () => {
    if (messaging) return;
    setMessaging(true);
    try {
      const res = await api.post("/conversations", { participantUsername: profile.username });
      const conversationId = res.data.conversation._id;
      navigate(`/messages?c=${conversationId}`);
    } catch (err) {
      toast({ title: "Error", description: "Could not start conversation.", variant: "destructive" });
    } finally {
      setMessaging(false);
    }
  };

  return (
    <div className="border-b border-border bg-card">
      <div className="container max-w-4xl py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <UserAvatar
              username={profile.username}
              displayName={profile.name}
              className="h-20 w-20"
              textClassName="text-2xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{profile.name}</h1>
                {profile.openToWork && <Badge variant="success">Open to work</Badge>}
              </div>
              {profile.headline && (
                <p className="text-sm text-muted-foreground">{profile.headline}</p>
              )}
              {!profile.headline && profile.role && (
                <p className="text-sm text-muted-foreground">
                  {profile.role} · {profile.company}
                </p>
              )}
              {profile.about ? (
                <p className="mt-3 max-w-md text-sm text-foreground/90">{profile.about}</p>
              ) : profile.bio ? (
                <p className="mt-3 max-w-md text-sm text-foreground/90">{profile.bio}</p>
              ) : null}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {profile.location}
                  </span>
                )}
                {profile.github && (
                  <span className="flex items-center gap-1">
                    <Github className="h-3 w-3" /> {profile.github}
                  </span>
                )}
                {profile.website && (
                  <span className="flex items-center gap-1">
                    <Link2 className="h-3 w-3" /> {profile.website}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Joined {joinedDate}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.stack.map((tech) => (
                  <Badge key={tech} variant="mono">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {!isOwnProfile ? (
            <div className="flex shrink-0 gap-2">
              <Button variant={following ? "outline" : "default"} onClick={toggleFollow}>
                {following ? "Following" : "Follow"}
              </Button>
              <Button variant="outline" onClick={handleMessage} disabled={messaging}>
                {messaging ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Starting…
                  </span>
                ) : (
                  <>
                    <MessageCircle className="mr-1 h-4 w-4" /> Message
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button variant="outline" asChild>
              <a href="/settings/profile">Edit profile</a>
            </Button>
          )}
        </div>

        <div className="mt-5 flex items-center gap-5 text-sm">
          <span>
            <strong className="font-semibold">{followers.toLocaleString()}</strong>{" "}
            <span className="text-muted-foreground">followers</span>
          </span>
          <span>
            <strong className="font-semibold">{followingCount.toLocaleString()}</strong>{" "}
            <span className="text-muted-foreground">following</span>
          </span>
          {profile.openToCollab && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3.5 w-3.5" /> Open to collaboration
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
