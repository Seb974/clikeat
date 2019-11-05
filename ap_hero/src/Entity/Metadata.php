<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass="App\Repository\MetadataRepository")
 * @ApiResource(
 *  attributes={
 *          "normalization_context"={"groups"={"metadata"}}
 *     },
 *      subresourceOperations={
 *          "api_users_metadata_get_subresource"={
 *              "method"="GET",
 *              "normalization_context"={"groups"={"user"}}
 *          }
 *      }
 * )
 */
class Metadata
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     * @Groups({"user", "metadata"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"user", "metadata"})
     */
    private $type;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"user", "metadata"})
     */
    private $field;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="metadata", cascade={"persist"})
     * 
     */
    private $user;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): self
    {
        $this->type = $type;

        return $this;
    }

    public function getField(): ?string
    {
        return $this->field;
    }

    public function setField(?string $field): self
    {
        $this->field = $field;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }
}
